// This is the js for the default/index.html view.

var app = function() {
  var self = {};

  Vue.config.silent = false; // show all warnings

  // Extends an array
  self.extend = function(a, b) {
    for (var i = 0; i < b.length; i++) {
      a.push(b[i]);
    }
  };

  var enumerate = function(v) {
    var k = 0;
    return v.map(function(e) {
      e._idx = k++;
    });
  };

  function getGamesURL(startIdx, endIdx) {
    var pp = {
      start_idx: startIdx,
      end_idx: endIdx
    };
    return gamesURL + "?" + $.param(pp);
  }

  self.getUser = function() {
    $.getJSON(getUserURL, function(data) {
      self.vue.userEmail = data.email;
    });
  };

  self.getGames = function() {
    $.getJSON(getGamesURL(0, 10), function(data) {
      self.vue.games = data.games;
      self.vue.hasMore = data.has_more;
      self.vue.loggedIn = data.logged_in;
      enumerate(self.vue.games);
    });
  };

  self.getMore = function() {};

  self.addGame = function() {
    $.post(
      addGameURL,
      {
        title: self.vue.formTitle,
        activity: self.vue.formActivity,
        level: self.vue.formLevel,
        time: self.vue.formTime,
        location: self.vue.formLocation,
        description: self.vue.formDescription
      },
      function(data) {
        self.vue.isAddingGame = false;
        self.vue.games.unshift(data.game);
        enumerate(self.vue.games);
        self.vue.formTitle = "";
        self.vue.formDescription = "";
        self.vue.formLocation = "";
        self.vue.formActivity = "";
        self.vue.formTime = "";
        self.vue.formLevel = "";
      }
    );
  };

  self.cancelAddGame = function() {
    self.vue.isAddingGame = false;
  };

  self.addGameButton = function() {
    self.vue.isAddingGame = true;
  };

  self.togglePublic = function(game) {
    $.post(togglePublicURL, { id: game.id }, function(data) {
      self.vue.games[game._idx].is_public = !game.is_public;
    });
  };

  self.deleteGame = function(game) {
    $.post(deleteGameURL, { id: game.id }, function(data) {
      self.vue.games.splice(game._idx, 1);
      enumerate(self.vue.games);
    });
  };

  // Complete as needed.
  self.vue = new Vue({
    el: "#vue-div",
    delimiters: ["${", "}"],
    unsafeDelimiters: ["!{", "}"],
    data: {
      isAddingGame: false,
      games: [],
      hasMore: false,
      loggedIn: true,
      userEmail: null,
      formTitle: null,
      formDescription: null,
      formActivity: "activity",
      formLevel: "Level",
      formLocation: null,
      formTime: null
    },
    methods: {
      togglePublic: self.togglePublic,
      addGameButton: self.addGameButton,
      getMore: self.getMore,
      addGame: self.addGame,
      cancelAddGame: self.cancelAddGame,
      deleteGame: self.deleteGame
    }
  });

  self.getGames();
  self.getUser();
  $("#vue-div").show();

  return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function() {
  APP = app();
});
