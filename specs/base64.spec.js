'use strict';

var expect = require('expect.js');
var imageSize = require('..');

var formats = {
  'png': {
    'data': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAANCAYAAACKCx+LAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAA10lEQVQYGWP8DwQMSODv338MzMxMDEwwsUtXrjCEREQzuHn7MXz58oWBAaQDBJpa2/+vXL32/9+/f8F8uI43b98xKCkpMjAxQYTgEj9//mBghgqCjQfpe/3mzX8VTd3/L16+AhsDIhjyikr/2zq5/T96/MT/f//+ISRevHj5f/2mzf+tHVz+f/32DSEBYoFc4h8S/v/K1WtwCbDlIJfIy8kx/PjxA+YthAeFBAUYnjx7BpeAe/DEyVP/TSxt/0cnJP8H+vw/I8hQmLI/f/4wAB3AwMvDwwAADdme+yaOE+YAAAAASUVORK5CYII=',
    'width': 6,
    'height': 13  
  },
  'jpg': {
    'data': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAAigAwAEAAAAAQAAAAkAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAAkACAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMEAwMDBAUEBAQEBQcFBQUFBQcIBwcHBwcHCAgICAgICAgKCgoKCgoLCwsLCw0NDQ0NDQ0NDQ3/2wBDAQICAgMDAwYDAwYNCQcJDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ3/3QAEAAH/2gAMAwEAAhEDEQA/AP1e/Z6sfsWufExv7N8a6d9o8aahLnxhc/aIbjcifvdH+d9mmN1hTPy8jjG1fp6s23/1y/j/ACrSqpCif//Z',
    'width': 8,
    'height': 9
  },
  'bmp': {
    'data': 'data:image/bmp;base64,Qk1eAgAAAAAAADYAAAAoAAAABgAAAOn///8BACAAAAAAAAAAAAATCwAAEwsAAAAAAAAAAAAAjIqM/5KOj/+KjI7/hYqK/4uMjP+Ljo7/h4qM/4yOjf+NjYz/kY6O/4yKjf+Mi4n/iImK/46Pj/+MjIz/jIyR/4+Pkf+Iiof/iYqO/46Nj/+NjIz/j42J/4qLiv+Jioz/iYqJ/4yMjf+NjY3/jI2N/42MjP+LjYj/kI2O/4iLi/+LjIv/j42O/4+Mjv+LjYz/jo6M/42Kh/+KjIz/kYyO/4qLjP+QjpP/i4qJ/4yLi/+Mior/joqK/4iKiP+Rjo//i4qL/46MjP+QjI3/iYuL/4mJif+Nior/i4yN/4+Ljv+NjJL/ioqM/4+Mjf+LiYr/iYqI/4uMiP+LjI7/joyI/4mMiv+Miof/iomK/46Ojv+OjY3/j4uI/4mMjv+PjZD/j4uL/5CNjv+Nj4//iouJ/46Ojv+Njo//kI6P/5COjv+Ji4z/jI6N/46Mif+KjY3/jYuN/42Mjv+Ki4v/i42M/4qKiv+Gio3/j4uJ/5GOjv+Njo//jY2L/5GNjP+Ojo//kY6Q/4qMi/+NjY7/j42L/4yMi/+Oion/iYmH/5CMkP+NjI//i4uN/4qLi/+JiYX/i4uJ/5GOjv+MjI3/jIqK/42Li/+JiYv/lJGT/46Miv+Ji4r/iY2M/42Nj/+Kjo3/jIuL/42OjP+LjY7/j4+P/4mJiv+Oj4z/iIqN/4uMjP+LjI3/iomK/4+Njf+Ni4v/kIuO/4mMj/+FiIn/ioqL/42Ojv+PkJP/',
    'width': 6,
    'height': 23
  },
  'gif': {
    'data': 'data:image/gif;base64,R0lGODdhAgAJAJEAAAAAAIyMjP///wAAACH5BAkAAAMALAAAAAACAAkAAAIEjI95BQA7',
    'width': 2,
    'height': 9
  }
};

// Test above valid base64 images
describe('Valid base64 images', function () {
  
  Object.keys(formats).forEach(function (format) {
    describe(format, function() {
      var dimensions;  
      beforeEach(function(){
        dimensions = imageSize(formats[format].data);
      });
      it ('should return the correct size for ' + format, function() {
        var expected = formats[format];
        expect(dimensions.width).to.be(expected.width);
        expect(dimensions.height).to.be(expected.height);
      });
    });
  });

  Object.keys(formats).forEach(function (format) {
    describe('with callback for'+ format, function() {
      var dimensions;  
      beforeEach(function(done){
        imageSize(formats[format].data, function(err, _dim) {
          dimensions = _dim;
          done();
        });
      });
      it ('should return the correct size for ' + format, function() {
        var expected = formats[format];
        expect(dimensions.width).to.be(expected.width);
        expect(dimensions.height).to.be(expected.height);
      });
    });
  });
});
