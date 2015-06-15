import TrackersStore from '../stores/trackers';
import TrackerComponent from './tracker';

TrackersStore.initialize();

export default {
  data() {
    // TODO here or on top level component (App?)
    // TODO pass down or not?
    // TODO does not work if not a function
    return {
      trackers: TrackersStore.data,
      newTrackerName: ''
    }
  },

  methods: {
    createTracker(e) {
      e.preventDefault();

      let val = this.newTrackerName.trim();
      // TODO validation here or in store? both?
      if(!val) return;

      TrackersStore.create(val);
      this.newTrackerName = '';
    }
  },

  components: {
    tracker: TrackerComponent
  },

  // TODO track-by
  template: `
    <div class="row header">
      <div class="col m6 s12">
        <h1 class="header-logo light-text">Hours</h1>
      </div>
      <form class="col m6 s12" v-on="submit: createTracker">
        <div class="row valign-wrapper header-form-wrapper">
          <div class="input-field col s12 valign">
            <input placeholder="Enter new tracker name and press enter" type="text" v-model="newTrackerName">
            <!-- TODO LABELS -->
          </div>
        </div>
      </form>
    </div>
    <div class="divider"></div>

    <!-- TODO when no tracker -->
    <!-- TODO tracker is not the right word, maybe sto watch? tracker? -->
    <div class="row" v-if="trackers.length === 0">
      <div class="col s12" >
        <p class="flow-text center-align">
          Welcome to Hours!<br/>
          Use the input at the top right of the page to create your first time tracker.
        </p>
      </div>
    </div>
    <div class="row trackers-list">
      <div class="trackers-list">
        <tracker v-repeat="tracker: trackers" track-by="id"></tracker>
      </div>
    </div>
  `
};