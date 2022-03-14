// 获取样式
function getStyle(el, name) {
  if (window.getComputedStyle) {
    return getComputedStyle(el, null)[name];
  }
  if (el.currentStyle) {
    return el.currentStyle[name];
  }
}

// 位置是否首屏中
function isInFS(target) {
  if (!target || !target.getBoundingClientRect) return false;
  const rect = target.getBoundingClientRect();
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  return (
    rect.left >= 0 &&
    rect.left < screenWidth &&
    rect.top >= 0 &&
    rect.top < screenHeight
  );
}

// 是否可见
function isVisible(target) {
  target.style.opacity = 'inherit';
  const rawOpacity = getStyle(target, 'opacity');
  const visibility = getStyle(target, 'visibility');

  let opacity = +rawOpacity;
  if (opacity !== rawOpacity) {
    opacity = 1; // can not check old browser
  }
  if (opacity > 0.09 || visibility === 'visible') {
    return true;
  }
  return false;
}

// 首屏中，并且可见
function isInFSAndVisible(target) {
  if (!target || !target.getBoundingClientRect) return false;
  const rect = target.getBoundingClientRect();
  const isvisible = isVisible(target);
  const hasArea = rect.width > 0 && rect.height > 0;

  return isInFS(target) && hasArea && isvisible;
}

// 是否已经存在节点，或者是长辈节点
function isElderOrExitEle(target, arr) {
  if (!target || target === document.documentElement) {
    return false;

    // 说明数组已经存在这个节点
  }
  if (arr.indexOf(target) !== -1) {
    return true;

    // 不要长辈节点
  }
  return isElderOrExitEle(target.parentElement, arr);
}

// dom 是否有效，过滤
function isEleValid(ele, arr) {
  const ignoreEleList = ['script', 'style', 'link', 'br'];
  const nodeName = ele.nodeName.toLocaleLowerCase();
  const isEleNode = ele.nodeType === 1;
  const isRenderNode = ignoreEleList.indexOf(nodeName) === -1;
  if (isEleNode && isRenderNode) {
    if (isInFS(ele)) {
      // 图片另算
      if (nodeName === 'img') {
        return true;
      }
      if (!isElderOrExitEle(ele, arr)) {
        return true;
      }
    }
  }
  return false;
}

class PerformanceCalculator {
  static perfInstance = null; // 保证单例

  imgResource = [];

  // 保证监听实例单一，防止spa切换产生新的监听
  currentObserverDom = null;

  observeTimer = null;

  observeBeginTime = 0;

  constructor() {
    if (PerformanceCalculator.perfInstance) {
      return PerformanceCalculator.perfInstance;
    }

    PerformanceCalculator.perfInstance = this;
    this.init();
  }

  init() {
    this.hackClearResourceTimings();
  }

  hackClearResourceTimings() {
    const origin = performance.clearResourceTimings;

    const that = this;

    performance.clearResourceTimings = function hackClearResourceTimings(
      ...args
    ) {
      try {
        const imgs = that.getImgResource();

        that.imgResource = [...that.imgResource, ...imgs];

        console.log('保存');
      } catch (error) {
        console.log('hackClearResourceTimings error', error);
      }
      return origin.apply(this, args);
    };
  }

  hackImgOnload(node) {
    if (node.complete)
      return Promise.resolve(this.getImgFromResource(node)?.responseEnd || 0);

    return new Promise(resolve => {
      const originLoad = node.onload;
      const originError = node.onerror;
      node.onload = function (...args) {
        resolve(performance.now());
        return originLoad?.apply?.(this, args);
      };
      node.onerror = function (...args) {
        resolve(0);
        return originError?.apply?.(this, args);
      };
    });
  }

  initFirstScreenObserveNodes() {
    this.resetObserve();
    return new Promise(res => {
      const details = [];
      this.currentObserverDom = new MutationObserver(mutations => {
        if (!mutations || !mutations.forEach) return;
        const detail = {
          time: performance.now(),
          roots: [],
          imgs: [],
        };

        mutations.forEach(mutation => {
          if (
            !mutation ||
            !mutation.addedNodes ||
            !mutation.addedNodes.forEach
          ) {
            return;
          }
          mutation.addedNodes.forEach(ele => {
            const nodeName = ele.nodeName.toLocaleLowerCase();
            const isImg = nodeName === 'img';
            const isValidEle = isEleValid(ele, detail.roots);

            // console.log('ele', ele, isImg, isValidEle);
            if (isImg) {
              detail.imgs.push(ele);
            } else if (isValidEle) {
              detail.roots.push(ele);
            }
          });
        });
        if (detail.roots.length) {
          details.push(detail);
        }
      });
      this.currentObserverDom.observe(document, {
        childList: true,
        subtree: true,
      });

      // 5s之内先收集所有的dom变化，并以key（时间戳）、value（dom list）的结构存起来。
      this.observeTimer = setTimeout(() => {
        this.currentObserverDom.disconnect();
        console.log('details', details);
        res(details);
      }, 5000);
    });
  }

  // 路由切换的时候，需要重置数据
  resetObserve() {
    if (!this.currentObserverDom) return;

    this.currentObserverDom?.disconnect?.();
    clearTimeout(this.observeTimer);
    this.observeBeginTime = 0;

    // 清除图片资源，因为已经是上个路由的数据了
    this.imgResource = [];
  }

  checkImgResValid(resource) {
    const time = this.observeBeginTime;
    const { responseEnd = 0, duration = 0 } = resource || {};

    // 资源加载结束时间比 路由开始切换还要早，说明不是路由切换后加载的
    // 资源加载时间 < 加载结束时间 - 路由开始时间，说明不是路由切换后加载的
    if (time > responseEnd || responseEnd - time < duration) {
      return false;
    }

    return true;
  }

  async getAllImgLoadTime(allImgs) {
    let allImgLoadTimes = [];
    const unloadImgs = allImgs.filter(img => !img.complete);
    const loadImgs = allImgs.filter(img => img.complete);

    // 处理已经加载ok的图片
    loadImgs.forEach(img => {
      const resource = this.getImgFromResource(img);
      if (resource && this.checkImgResValid(resource)) {
        allImgLoadTimes.push(resource.responseEnd);
      }
    });

    // 处理没有加载ok的图片
    const result = await Promise.all(
      unloadImgs.map(img => this.hackImgOnload(img))
    );

    allImgLoadTimes = [...allImgLoadTimes, ...result];
    return allImgLoadTimes;
  }

  getImgFromResource(imgNode) {
    const imgResource = [...this.imgResource, ...this.getImgResource()];
    return imgResource.find(res => res.name.indexOf(imgNode.src) > -1) || {};
  }

  getImgResource() {
    // reverse 是为了保证最新的资源在最前面，而不是老资源
    return (
      window.performance
        .getEntriesByType('resource')
        .filter(res => res.initiatorType === 'img')
        .reverse() || []
    );
  }

  async getCompareTime(details, now) {
    // 分析上面收集到的数据，返回最终的结果
    const domRenderTime = [];
    let allImgs = [];
    let allImgLoadTimes = [];

    details.forEach(detail => {
      // 拿到所有首屏DOM 的 渲染时间
      for (let i = 0; i < detail.roots.length; i++) {
        const ele = detail.roots[i];
        if (ele && isInFSAndVisible(ele)) {
          domRenderTime.push(detail.time);
          const imgs = ele.getElementsByTagName('img');
          let nodelist = Array.prototype.slice.call(imgs) || []; // o
          nodelist = nodelist.filter(node => isInFSAndVisible(node));

          allImgs = allImgs.concat(nodelist);
          // 同一个 detail 的 节点，时间一样，不用继续收集了
          // break;
        }
      }

      // 拿到所有首屏中的图片
      for (let i = 0; i < detail.imgs.length; i++) {
        const ele = detail.imgs[i];
        if (ele && isInFSAndVisible(ele)) {
          allImgs.push(ele);
        }
      }
    });

    // 遍历当前请求的图片中，如果有开始请求时间在首屏dom渲染期间的，则表明该图片是首屏渲染中的一部分
    // 所以dom渲染时间和图片返回时间中大的为首屏渲染时间
    if (allImgs.length > 0) {
      allImgLoadTimes = await this.getAllImgLoadTime(allImgs);
    }

    console.log('allImgs', allImgs);
    console.log('domRenderTime', domRenderTime);
    console.log('allImgLoadTimes', allImgLoadTimes);

    let resultTime = 0;

    if (domRenderTime.length > 0 || allImgLoadTimes.length > 0) {
      resultTime = Math.max(...domRenderTime, ...allImgLoadTimes) - now;
    }

    return resultTime;
  }

  getFirstScreenTime(now = 0) {
    this.observeBeginTime = now;
    return new Promise(resolve => {
      try {
        this.initFirstScreenObserveNodes().then(async nodes => {
          const resultTime = await this.getCompareTime(nodes, now);
          resolve(resultTime);
        });
      } catch (error) {
        resolve(0);
        console.error(error);
      }
    });
  }
}

export default function initObserveSpaFirstScreenRenderTime() {
  if (initObserveSpaFirstScreenRenderTime.isInit) {
    return;
  }

  window.addEventListener('hashchange', () => {
    console.log('hashChange');
  });

  window.addEventListener('popstate', () => {
    console.log('popstate', new PerformanceCalculator());
    new PerformanceCalculator()
      .getFirstScreenTime(performance.now())
      .then(time => {
        console.log('time', time);
      });
  });

  initObserveSpaFirstScreenRenderTime.isInit = true;
}
