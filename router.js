class Router {
  constructor(routes) {
    this.match = ({ url, execute }) => {
      const { pattern, handler } = routes.find(({ pattern })=> pattern.test(url)) ?? {};
      const match = pattern?.exec(url);
      if (execute) {
        if (handler) {
          handler(match);
        }
      } else {
        return match;
      }
    };
    window.addEventListener('popstate', () => {
      this.match({ url: window.location.href, execute: true });
    });
  }
  navigate(url) {
    window.history.pushState({}, '', url);
    this.match({ url, execute: true });
  }
}
