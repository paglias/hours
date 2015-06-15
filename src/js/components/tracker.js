import TrackersStore from '../stores/trackers';

export default {
  data() {
    return {
      // TODO use a computed?
      totalElapsed: undefined,
      newTrackerName: undefined// TODO this.tracker.name not avalaible!!!! setting in created
    }
  },

  methods: {
    updateTotalElapsed() {
      // TODO check rounding and calculations
      // TODO move this to a single big interval that updates all the trackers?
      let ms = this.tracker.previouslyElapsed;

      if(this.tracker.paused === false){
        ms += Date.now() - this.tracker.lastStartDate;
      }

      let hours = Math.floor(ms / 3600000);
      let minutes = Math.floor((ms - (hours * 3600000)) / 60000);
      let seconds = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);

      hours = hours < 10 ? '0'+hours : hours;
      minutes = minutes < 10 ? '0'+minutes : minutes;
      seconds = seconds < 10 ? '0'+seconds : seconds;

      this.totalElapsed = hours+':'+minutes+':'+seconds;
    },

    togglePauseTracker() {
      // Here there's still the old value (paused will be started)
      // TODO ok to block before triggering action? or after?
      if(this.tracker.paused){
        this.intervalId = setInterval(this.updateTotalElapsed, 250);
      }else{
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }

      TrackersStore.togglePause(this.tracker.id);
    },

    resetTracker(){
      TrackersStore.reset(this.tracker.id);
      this.updateTotalElapsed();
      if(this.intervalId){
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(this.updateTotalElapsed, 250);
    },

    destroyTracker() {
      TrackersStore.destroy(this.tracker.id);
    }
  },

  watch: {
    newTrackerName(newVal, oldVal){
      if(newVal === oldVal || newVal === this.tracker.name){
        return;
      }

      TrackersStore.changeName(this.tracker.id, newVal);
    }
  },

  created() {
    this.updateTotalElapsed();
    this.newTrackerName = this.tracker.name;

    if(!this.tracker.paused){
      // TODO better place to store this.intervalId?
      this.intervalId = setInterval(this.updateTotalElapsed, 250);
    }
  },

  destroyed() {
    if(this.intervalId){
      clearInterval(this.intervalId);
    }
  },

  replace: true,
  template: `
    <div class="col s12 tracker-item-wrapper">
      <div class="row tracker-item">
        <div class="input-field col m4 s6 tracker-item-input">
          <input placeholder="Tracker name" type="text" v-model="newTrackerName" />
          <!-- TODO LABELS -->
        </div>

        <div class="col l5 m4 s6 tracker-item-tracker center-align">
          <h3 class="light-text">{{totalElapsed}}</h3>
        </div>

        <!-- TODO 600<px<620 li mostra malino-->
        <div class="col l3 m4 s12 tracker-item-buttons center-align">
          <button class="btn-floating btn-large blue-grey"
                  v-on="click: togglePauseTracker"
                  title="{{tracker.paused ? 'Play' : 'Pause'}}">
                    <i class="mdi-{{tracker.paused ? 'av-play-arrow' : 'av-pause'}}"></i>
          </button>
          <button class="btn-floating btn-large blue-grey"
                  v-on="click: resetTracker"
                  title="Reset">
                    <i class="mdi-action-restore"></i>
                  </button>
          <button class="btn-floating btn-large blue-grey"
                  v-on="click: destroyTracker"
                  title="Remove">
                    <i class="mdi-action-delete"></i>
          </button>
        </div>
      </div>
    </div>
  `
};