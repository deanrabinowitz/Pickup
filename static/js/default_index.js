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

  function getMemosURL(startIdx, endIdx) {
    var pp = {
      start_idx: startIdx,
      end_idx: endIdx
    };
    return memosURL + "?" + $.param(pp);
  }

  self.getUser = function() {
    $.getJSON(getUserURL, function(data) {
      self.vue.userEmail = data.email;
    });
  };

  self.getMemos = function() {
    $.getJSON(getMemosURL(0, 10), function(data) {
      self.vue.memos = data.memos;
      self.vue.hasMore = data.has_more;
      self.vue.loggedIn = data.logged_in;
      enumerate(self.vue.memos);
    });
  };

  self.getMore = function() {};

  self.addMemo = function() {
    $.post(
      addMemoURL,
      {
        title: self.vue.formTitle,
        body: self.vue.formBody
      },
      function(data) {
        self.vue.isAddingMemo = false;
        self.vue.memos.unshift(data.memo);
        enumerate(self.vue.memos);
        self.vue.formTitle = "";
        self.vue.formBody = "";
      }
    );
  };

  self.cancelAddMemo = function() {
    self.vue.isAddingMemo = false;
  };

  self.addMemoButton = function() {
    self.vue.isAddingMemo = true;
  };

  self.togglePublic = function(memo) {
    $.post(togglePublicURL, { id: memo.id }, function(data) {
      self.vue.memos[memo._idx].is_public = !memo.is_public;
    });
  };

  self.deleteMemo = function(memo) {
    $.post(deleteMemoURL, { id: memo.id }, function(data) {
      self.vue.memos.splice(memo._idx, 1);
      enumerate(self.vue.memos);
    });
  };

  // Complete as needed.
  self.vue = new Vue({
    el: "#vue-div",
    delimiters: ["${", "}"],
    unsafeDelimiters: ["!{", "}"],
    data: {
      isAddingMemo: false,
      memos: [],
      hasMore: false,
      loggedIn: true,
      userEmail: null,
      formTitle: null,
      formBody: null
    },
    methods: {
      togglePublic: self.togglePublic,
      addMemoButton: self.addMemoButton,
      getMore: self.getMore,
      addMemo: self.addMemo,
      cancelAddMemo: self.cancelAddMemo,
      deleteMemo: self.deleteMemo
    }
  });

  self.getMemos();
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
