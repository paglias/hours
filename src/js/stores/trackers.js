import uuid from 'uuid';
// TODO import only modules we need
import _ from 'lodash';
import storage from '../libs/storage';

// TODO where to do validations for all this methods? necessary at all?
export default {
  // TODO make read only when used externally
  // TODO rename to trackers?
  // TODO use object for ids indexed?
  data: [],

  initialize() {
    let self = this;

    storage.get('trackers', function(res){
      if(res && Array.isArray(res)){
        self.data.push(...res);
      }
    });
  },

  // TODO save individually, not too frequently?
  _save() {
    storage.set('trackers', this.data);
  },

  create(name) {
    // TODO handle changes to schema for items already saved
    this.data.unshift({
      id: uuid.v4(),
      name: name,
      paused: false,
      previouslyElapsed: 0,
      lastStartDate: Date.now()
    });
    console.log(this.data)

    this._save();
  },

  togglePause(id) {
    // TODO rename param to something else? el, doc...?
    let tracker = _.find(this.data, {id: id});
    if(!tracker) return;

    let now = Date.now();

    if(tracker.paused){
      tracker.lastStartDate = now;
    }else{
      tracker.previouslyElapsed = tracker.previouslyElapsed + now - tracker.lastStartDate;
    }

    tracker.paused = !tracker.paused;

    this._save();
  },

  changeName(id, newName) {
    // TODO rename param to something else? el, doc...?
    let tracker = _.find(this.data, {id: id});
    if(!tracker) return;

    tracker.name = newName;

    this._save();
  },

  reset(id) {
    // TODO rename param to something else? el, doc...?
    let tracker = _.find(this.data, {id: id});
    if(!tracker) return;

    tracker.previouslyElapsed = 0;
    tracker.paused = false;
    tracker.lastStartDate = Date.now();

    this._save();
  },

  destroy(id) {
    let iToRemove = _.findIndex(this.data, {id: id});
    if(iToRemove === -1) return;

    // TODO we canno use _.pullAt because Vue doesn't recognize the change
    this.data.splice(iToRemove, 1);
    this._save();
  }
};