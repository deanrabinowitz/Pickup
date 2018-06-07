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

  self.getUser = function() {
    $.getJSON(getUserURL, function(data) {
      self.vue.user = data;
    });
  };

  self.getGames = function() {
    $.post(
      gamesURL,
      {
        start_idx: 0,
        end_idx: 10,
        activityFilter: self.vue.activityFilter,
        levelFilter: self.vue.levelFilter
      },
      function(data) {
        self.vue.games = data.games;
        self.vue.hasMore = data.hasMore;
        self.vue.loggedIn = data.loggedIn;
        enumerate(self.vue.games);
      }
    );
  };

  self.loadMore = function() {
    var numGames = self.vue.games.length;
    $.post(
      gamesURL,
      {
        start_idx: numGames,
        end_idx: numGames + 20,
        activityFilter: self.vue.activityFilter,
        levelFilter: self.vue.levelFilter
      },
      function(data) {
        self.extend(self.vue.games, data.games);
        self.vue.hasMore = data.hasMore;
        enumerate(self.vue.games);
      }
    );
  };

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
        $("#datePicker").val("");
        $("#startTimePicker").val("");
        $("#endTimePicker").val("");
        $("#timePicker").hide();
        self.vue.isAddingGame = false;
        self.vue.games.unshift(data.game);
        enumerate(self.vue.games);
        self.vue.formTitle = "";
        self.vue.formDescription = "";
        self.vue.formLocation = "";
        self.vue.formActivity = "basketball";
        self.vue.formLevel = "allLevels";
      }
    );
  };

  self.addComment = function(gameID, commentContent, game) {
    if (commentContent === "") {
      return;
    }
    game.formComment = "";
    var user = self.vue.user;
    var comment = {
      authorID: user.id,
      author_name: user.firstName + " " + user.lastName[0] + ".",
      comment_content: commentContent,
      game: gameID
    };
    game.comments.push(comment);
    $.post(
      addCommentURL,
      {
        gameID: gameID,
        commentContent: commentContent
      },
      function(data) {
        // add the date to the comment
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

  self.getLevels = function() {
    return [
      { text: "All Levels", value: "allLevels" },
      { text: "Beginner", value: "beginner" },
      { text: "Intermediate", value: "intermediate" },
      { text: "Advanced", value: "advanced" }
    ];
  };

  self.getActivities = function() {
    return [
      { text: "Baseball", value: "baseball" },
      { text: "Basketball", value: "basketball" },
      { text: "Football", value: "football" },
      { text: "Soccer", value: "soccer" },
      { text: "Tennis", value: "tennis" },
      { text: "Ultimate Frisbee", value: "ultimateFrisbee" },
      { text: "Volleyball", value: "volleyball" },
      { text: "Other", value: "other" }
    ];
  };

  self.getActivityText = function(myActivity) {
    for (var activity in self.vue.activities) {
      if (myActivity === self.vue.activities[activity].value) {
        return self.vue.activities[activity].text;
      }
    }
  };

  self.getLevelText = function(myLevel) {
    for (var level in self.vue.levels) {
      if (myLevel === self.vue.levels[level].value) {
        return self.vue.levels[level].text;
      }
    }
  };

  self.resetFilters = function() {
    self.vue.activityFilter = self.getActivities().map(function(activity) {
      return activity.value;
    });
    self.vue.levelFilter = self.getLevels().map(function(level) {
      return level.value;
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
      formActivity: "basketball",
      formLevel: "allLevels",
      formLocation: null,
      levels: self.getLevels(),
      activities: self.getActivities(),
      activityFilter: self.getActivities().map(function(activity) {
        return activity.value;
      }),
      levelFilter: self.getLevels().map(function(level) {
        return level.value;
      })
    },
    methods: {
      addGameButton: self.addGameButton,
      loadMore: self.loadMore,
      addGame: self.addGame,
      cancelAddGame: self.cancelAddGame,
      deleteGame: self.deleteGame,
      joinGame: self.joinGame,
      leaveGame: self.leaveGame,
      addComment: self.addComment,
      getGames: self.getGames,
      getActivityText: self.getActivityText,
      getLevelText: self.getLevelText,
      resetFilters: self.resetFilters
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
