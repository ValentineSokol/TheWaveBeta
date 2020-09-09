export default (object) => {
    if (!object || !typeof object === 'object') throw new Error('The argument should be an object!');
    const body = new FormData();
    for (const key in object) {
      const value = object[key];
      if (Array.isArray(value)) {
        for (const item of value) {
          body.append(key, item);
        }
        continue;
      }
      body.append(key, object[key]);  
    }
    return body;
}