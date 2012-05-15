/*******************************************
* Users
*******************************************/

var addUser = function (name, username, password, sessionToken) {
	var user, result = {};

	if (user = getUserBySessionToken(sessionToken)) {
		if (insertUser(name, username, password)) {
			result.success = true;
		} else {
			result.success = false;
			result.reason = "error";
		}
	} else {
		result.success = false;
		result.reason = "authentication";
	}
};

/*******************************************
* Records
*******************************************/

var addRecord = function (title, is_private, sessionToken) {
	var user, result = {};

	if (user = getUserBySessionToken(sessionToken)) {
		if (insertRecord(title, user._id, is_private)) {
			result.success = true;
		} else {
			result.success = false;
			result.reason = "error";
		}
	} else {
		result.success = false;
		result.reason = "authentication";
	}

	return result;
};

/*******************************************
* Authentication
*******************************************/

var login = function (username, password) {
	var sessionToken = getSessionTokenByUsernamePassword(username, password);
	var result = {};

	if (sessionToken) {
		result.success = true;
		result.sessionToken = sessionToken;
	} else {
		result.success = false;
		result.reason = "authentication";
	}

	return result;
};

var logout = function (sessionToken) {
	var success = clearUserBySessionToken(sessionToken);
	var result = {success: success === true};

	if (success !== true) {
		result.reason = "notexist";
	}

	return result;
};

/*******************************************
* Expose specific methods to the client
*******************************************/

Meteor.methods({
	addUser: addUser,
	addRecord: addRecord,
	login: login,
	logout: logout
	/*
	changePassword: changePassword,
	changeUser: changeUser,
	addUser: addUser,
	removeUser: removeUser,
	login: loginUser,
	sessionUser: sessionUser,
	logout: logoutSession
	*/
});

/*
function pageCount() {
  var posts = Posts.find();
  return Math.ceil(posts.count()/10);
}


function logoutSession(key) {
  return Stellar.session.delete(key); //Delete the session key
}

function checkAuth(auth) {
  sessionData = Stellar.session.get(auth); //Get session data
  if(sessionData) {
    return Users.findOne({username: sessionData.data.username}); //Make sure there is a user with this id
  } else {
    return false;
  }
}

function changePassword(args) {
  if(user = checkAuth(args.auth)) {
    if(hashPassword(args.current_password, user.salt) == user.password) {
      Users.update({_id: user.id}, {$set: {password: hashPassword(args.password, user.salt)}});
      return true;
    }
  }
  return false;
}

function changeUser(args) {
  if(user = checkAuth(args.auth)) {
    Users.update({_id: user.id}, {$set: {name: args.name}});
    return true;
  }
  return false;
}

function addUser(args) {
  if(user = checkAuth(args.auth)) {
    //strip out crap
    user = {name: args.name, username: args.username, password: args.password};
    createUser(user);
    return true;
  }
  return false;
}

function removeUser(args) {
  if(user = checkAuth(args.auth)) {
    Users.remove({_id: args.id});
    return true;
  }
  return false;
}

function changeSetting(args) {
  if(user = checkAuth(args.auth)) {
    _.each(args.settings, function(setting) {
      Settings.update({key: setting[0]}, {$set: {value: setting[1]}});
    });
    return true;
  }
  return false;
}

function deleteComment(args) {
  if(user = checkAuth(args.auth)) {
    Comments.remove({_id: args.commentId});
    return true;
  }
  return false;
}

function deletePost(args) {
  if(user = checkAuth(args.auth)) {
    Posts.remove({_id: args.commentId});
    return true;
  }
  return false;
}

function deleteBlogRoll(args) {
  if(user = checkAuth(args.auth)) {
    BlogRoll.remove({_id: args.id});
    return true;
  }
  return false;
}

function loginUser(username, password) {
  user = Users.findOne({username: username});
  if(user) {
    if(user.password == hashPassword(password, user.salt)) {
      thisUser = {name: user.name, username: user.username}; //Filter what is sent to the client, this can be then stored in a cookie safely
      sessionKey = Stellar.session.set(thisUser); //Set the session data
      thisUser['auth'] = sessionKey;
      return thisUser;
    }
  }
  throw new Meteor.Error(401, 'Login not correct');
  return false;
}

//Returns to the client what is stored in the session, don't do this if you are storing things in the session the client should not know
function sessionUser(key) {
  sessionKey = Stellar.session.get(key);
  if(sessionKey) {
    return sessionKey.data;
  }
  return false;
}

function makePost(args) {
  if(user = checkAuth(args.auth)) {
    post = Posts.findOne({slug: args.slug});
    //TODO If the user changes the slug, this will create a new post, Should fix at some point
    if(post) {
      Posts.update({slug: args.slug}, {$set: {
          title: args.title,
          body: args.body
        } 
      });
    } else {
      Posts.insert({
        title: args.title,
        body: args.body,
        slug: args.slug,
        userId: user._id,
        created: new Date()
      });
    }
    return true;
  }
  return false;
}

function insertBlogRoll(args) {
  if(user = checkAuth(args.auth)) {
    BlogRoll.insert({
      name: args.name,
      link: args.link,
      created: new Date()
    });
    return true;
  }
  return false;
}

function makeComment(args) {
  if(args && args.postId) {
    Comments.insert({
      postId: args.postId,
      name: args.name,
      comment: args.comment,
      created: new Date()
    });
  }
}

function setSetting(key, value, description) {
  if(!Settings.findOne({key: key})) {
    Settings.insert({
      key: key,
      value: value,
      description: description
    });
  }
}

function hashPassword(password, salt) {
  return Crypto.SHA256(salt + '-' + password);
}

function createUser(vals) {
  vals.salt = Crypto.SHA256(Math.random().toString());
  vals.password = hashPassword(vals.password, vals.salt);
  vals.created = new Date();
  id = Users.insert(vals);
  return id;
}
*/