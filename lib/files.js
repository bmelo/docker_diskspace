module.exports = {
  sys: require('sys'),
  exec: require('child_process').exec,
  cache: [],
  expiration: 6 * 3600000, //6 horas em milisegundos
  success: function () {
  },
  checkCache: function (key) {
    for (var k in this.cache) {
      if (this.cache[k].id === key) { //Achou item
        var now = new Date();
        if ((this.cache[k].date.getTime() + this.expiration) > now.getTime()) { //Verifica se prazo expirou
          return this.cache[k];
        } else {
          this.cache.splice(k, 1); //Remove o item do array
        }
        break;
      }
    }
    return false;
  },
  checkFinish: function (child) {
    if (child.status === 1) { //Processo terminado
      child.waiting.forEach(function (item) {
        module.exports.success(child.item, item);
      });
      return true;
    }
    setTimeout(function () { //Irá tentar novamente em 5seg
      module.exports.checkFinish(child);
    }, 5000);
    return false;
  },
  aguardaChild: function (key, res) {
    var child = this.checkCache(key);
    if (child.waiting === undefined) { //Cria um array de listeners waiting
      child.waiting = [];
    }
    child.waiting.push(res);
    this.checkFinish(child);
  },
  addCache: function (obj) {
    obj.date = new Date;
    var child = this.checkCache(obj.id);
    if (child !== false) { //Atualiza caso exista
      child.item = obj.item;
      child.status = obj.status;
    } else { //Adiciona um item novo
      this.cache.push(obj);
    }
  },
  getSizeDir: function (dir, res) {
    if (dir !== undefined) {
      var child = this.checkCache(dir);
      if (child === false) {
        var funcPuts = function (error, stdout, stderr) { //Função que fara a exportacao
          strout = stdout.replace(/\t.*/, '').trim();
          module.exports.addCache({ id: dir, item: strout, status: 1 });
          module.exports.success(strout, res);
        };
        child = this.exec('du -skb ' + dir, funcPuts);
        this.addCache({ id: dir });
      } else { //Já está no cache
        this.aguardaChild(dir, res);
      }
    } else {
      res.end();
    }
    return child;
  },
  getDiskUse: function (disk, res) {
    if (disk !== undefined) {
      var child = this.exec('df ' + disk + ' | tail -1', function (error, stdout, stderr) {
        var dados = stdout.trim().split(/\ +/);
        var arDados = {
          total: dados[0],
          used: dados[1],
          free: dados[2],
          percent: dados[3]
        };
        module.exports.success(arDados, res);
      });
      return child;
    } else {
      res.end();
    }
  }
};
