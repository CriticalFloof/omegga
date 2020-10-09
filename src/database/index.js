const path = require('path');

const Datastore = require('nedb-promise');

const soft = require('../softconfig.js');

// TODO: online users graph
// TODO: player online times
// TODO: bricks over time graph
// TODO: minute server status for metrics
// TODO: chat messages per min/hour/day check

let serverInstance;

// the database keeps track of metrics for omegga
class Database {
  constructor(options, omegga) {
    this.options = options;
    this.omegga = omegga;

    // create all the stores
    this.stores = {
      users: new Datastore({filename: path.join(omegga.dataPath, soft.USER_STORE), autoload: true}),
      chat: new Datastore({filename: path.join(omegga.dataPath, soft.CHAT_STORE), autoload: true}),
      plugin: new Datastore({filename: path.join(omegga.dataPath, soft.PLUGIN_STORE), autoload: true}),
      player: new Datastore({filename: path.join(omegga.dataPath, soft.PLAYER_STORE), autoload: true}),
      status: new Datastore({filename: path.join(omegga.dataPath, soft.STATUS_STORE), autoload: true}),
      server: new Datastore({filename: path.join(omegga.dataPath, soft.SERVER_STORE), autoload: true}),
    };
  }

  async getServerId() {
    if (serverInstance) return serverInstance;
    const doc = await this.stores.server.insert({
      type: 'start',
      date: new Date(),
    });
    serverInstance = doc;
    return doc;
  }
}

module.exports = Database;