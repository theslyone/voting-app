'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  Poll = mongoose.model('Poll'),
  Vote = mongoose.model('Vote'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Poll
 */
exports.create = function(req, res) {
  var poll = new Poll(req.body);
  poll.user = req.user;
  poll.options = req.body.options;

  poll.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poll);
    }
  });
};

/**
 * Show the current Poll
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var poll = req.poll ? req.poll.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  poll.isCurrentUserOwner = req.user && poll.user && poll.user._id.toString() === req.user._id.toString();
  poll.voted = req.user && poll.user && poll.votes.filter(function(vote)
  { return vote.user.toString() === req.user._id.toString(); }).length > 0;
  res.jsonp(poll);
};

/**
 * Update a Poll
 */
exports.update = function(req, res) {
  var poll = req.poll;

  poll = _.extend(poll, req.body);
  if(poll.vote){
    console.log("saving vote for " + poll._id);
    var vote = new Vote({ poll: poll._id, option: poll.vote, user: req.user });
    vote.save();
    poll.votes.push(vote);
  }
  poll.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poll);
    }
  });
};

/**
 * Delete an Poll
 */
exports.delete = function(req, res) {
  var poll = req.poll;

  poll.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poll);
    }
  });
};

/**
 * List of Polls
 */
exports.list = function(req, res) {
  Poll.find().sort('-created').populate('user displayName')
  .populate("votes")
  .exec(function(err, polls) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(polls);
    }
  });
};

/**
 * Poll middleware
 */
exports.pollByID = function(req, res, next, id) {
  //console.log("Poll id: " + id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Poll is invalid'
    });
  }

  Poll.findById(id)
  .populate('user', 'displayName')
  .populate("votes")
  .exec(function (err, poll) {
    if (err) {
      return next(err);
    } else if (!poll) {
      return res.status(404).send({
        message: 'No Poll with that identifier has been found'
      });
    }
    req.poll = poll;
    next();
  });
};
