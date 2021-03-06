var Meetup = require("meetup")
var mup = new Meetup()
let topicsCounter = {}
var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

server.listen(3002, () => console.log('Listening on port 3002'))


io.on('connection', socket => {
  console.log('got connection')
})


mup.stream("/2/rsvps", stream => {
  stream
    .on("data", item => {
        //make the selection
      const topicNames = item.group.group_topics
      .map(topic => topic.topic_name)

      //does topicNames include 'Software Development'
      if (topicNames.includes('Software Development')) {
      topicNames.forEach(name => {
        if (topicsCounter[name]) {
          topicsCounter[name]++
        }
        else {
          topicsCounter[name] = 1
        }
        })
        const arrayOfTopics = Object.keys(topicsCounter)

        arrayOfTopics.sort((topicA, topicB) => {
            if (topicsCounter[topicA] > topicsCounter[topicB]) {
              return -1
            }
            else if (topicsCounter[topicB] > topicsCounter[topicA]) {
              return 1
            }
            else {
              return 0
            }
          })

          const top10 = arrayOfTopics
            .slice(0,9)
            .map(topicName => {
            return{
            topic: topicName,
            count: topicsCounter[topicName]
            }
          })

          io.emit('action', arrayOfTopics)
          io.emit('action', top10)


        // console.log(top10)
        // console.log(arrayOfTopics)
      }

    }).on("error", e => {
        console.log("error! " + e)
     });
    })
  