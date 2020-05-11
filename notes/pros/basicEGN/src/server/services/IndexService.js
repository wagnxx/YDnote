export default class IndexService {
  constructor() {
    this.result = [{ title: 'vue' }, { title: 'webpack' }, { title: 'react' }];
  }

   getData() {
    return Promise.resolve(this.result);
  }
}
