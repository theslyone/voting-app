(function(){
  'use strict';

  Array.prototype.groupBy = function groupBy(col, value) {
    var r = [], o = {};
    this.forEach(function (a) {
      if(!o[a[col]]){
        o[a[col]] = {};
        o[a[col]][col] = a[col];
        o[a[col]][value] = 0;
        r.push(o[a[col]]);
      }
      o[a[col]][value] += +a[value];
    });
    return r;
  };
})();
