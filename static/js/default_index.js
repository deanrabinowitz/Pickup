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
      self.vue.user = data;
    });
  };

  self.getGames = function() {
    $.getJSON(getGamesURL(0, 10), function(data) {
      self.vue.games = data.games;
      self.vue.hasMore = data.hasMore;
      self.vue.loggedIn = data.loggedIn;
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
        gameLevel: self.vue.formLevel,
        startTime: $("#startTimePicker").val(),
        endTime: $("#endTimePicker").val(),
        gameDate: $("#datePicker").val(),
        gameLocation: self.vue.formLocation,
        description: self.vue.formDescription
      },
      function(data) {
        $("#startTimePicker").val("");
        $("#endTimePicker").val("");
        $("#timePicker").hide();
        self.vue.isAddingGame = false;
        self.vue.games.unshift(data.game);
        enumerate(self.vue.games);
        self.vue.formTitle = "";
        self.vue.formDescription = "";
        self.vue.formLocation = "";
        self.vue.formActivity = "activity";
        self.vue.formLevel = "level";
      }
    );
  };

  self.addComment = function(gameID, commentContent) {
    $.post(
      addCommentURL,
      {
        gameID: gameID,
        commentContent: commentContent
      },
      function(data) {
        console.log(data);
      }
    );
  };

  self.joinGame = function(game) {
    $.post(
      joinGameURL,
      {
        id: game.id
      },
      function(data) {
        console.log(data);
      }
    );
    if (!game.players.includes(self.vue.user.id)) {
      game.players.push(self.vue.user.id);
    }
  };

  self.leaveGame = function(game) {
    $.post(
      leaveGameURL,
      {
        id: game.id
      },
      function(data) {
        console.log(data);
      }
    );
    var index = game.players.indexOf(self.vue.user.id);
    if (index >= 0) {
      game.players.splice(index, 1);
    }
  };

  self.cancelAddGame = function() {
    self.vue.isAddingGame = false;
    $("#startTimePicker").val("");
    $("#endTimePicker").val("");
    $("#timePicker").hide();
  };

  self.addGameButton = function() {
    self.vue.isAddingGame = true;
    $("#timePicker").show();
    console.log("here");
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
      user: null,
      formTitle: null,
      formDescription: null,
      formActivity: "activity",
      formLevel: "level",
      formLocation: null,
      levelFilter: null,
      activityFilter: null,
      locationFilter: null,
      dateFilter: null
    },
    methods: {
      addGameButton: self.addGameButton,
      getMore: self.getMore,
      addGame: self.addGame,
      cancelAddGame: self.cancelAddGame,
      deleteGame: self.deleteGame,
      joinGame: self.joinGame,
      leaveGame: self.leaveGame,
      addComment: self.addComment
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
  // $("#timePicker").timepicker();
  $("#timePicker .time").timepicker({
    showDuration: true,
    timeFormat: "g:ia"
  });

  $("#timePicker .date").datepicker({
    format: "yyyy-m-d",
    autoclose: true
  });

  // initialize datepair
  // $("#timePicker").datepair();
});
