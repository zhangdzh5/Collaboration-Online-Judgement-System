let redisClient = require('../modules/redisClient');
let TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io) {

    var collaborations = [];
    // map from socketId to sessionId
    var socketIdToSessionId = [];

    let sessionPath = '/temp_sessions';

    io.on('connection', socket => {
        let sessionId = socket.handshake.query['sessionId'];

        socketIdToSessionId[socket.id] = sessionId;

        // add socket.id to corresponding collaboration session participants
        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            redisClient.get(sessionPath + '/' + sessionId, function(data) {
               if (data) {
                   console.log('previous session detected, polling back form Redis.');
                   collaborations[sessionId] = {
                       'cachedChangeEvents': JSON.parse(data),
                       'participants': []
                   };
               } else {
                   console.log('creating new session.');
                   collaborations[sessionId] = {
                       'cachedChangeEvents': [],
                       'participants': []
                   };
               }
               collaborations[sessionId]['participants'].push(socket.id);
            });
        }

        // socket event listeners
        socket.on('change', delta => {
            console.log('change ' + socketIdToSessionId[socket.id] + " " + delta);
            let sessionId = socketIdToSessionId[socket.id];

            if (sessionId in collaborations) {
                collaborations[sessionId]['cachedChangeEvents'].push(['change', delta, Date.now()]);
            }

            forwardEvents(socket.id, 'change', delta);
        });

        // cursor move listener
        socket.on('cursorMove', cursor => {
            console.log('Cursor Move at session: ' + socketIdToSessionId[socket.id] + ', socket: ' + socket.id + " " + cursor);
            cursor = JSON.parse(cursor);
            cursor['socketId'] = socket.id;

            forwardEvents(socket.id, 'cursorMove', JSON.stringify(cursor));
        });

        socket.on('restoreBuffer', () => {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('restoring buffer for session: ' + sessionId + ', socket: ' + socket.id);

            if (sessionId in collaborations) {
                let changedEvents = collaborations[sessionId]['cachedChangeEvents'];
                for (var i = 0; i < changedEvents.length; i++) {
                    socket.emit(changedEvents[i][0], changedEvents[i][1]);
                }
            }
        });

        socket.on('disconnect', function() {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('socket: ' + socket.id + ' disconnected.');
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                let index = participants.indexOf(socket.id);
                if (index >= 0) {
                    participants.splice(index, 1);
                    if (participants.length == 0) {
                        console.log('last participant left, storing in Redis.');
                        let key = sessionPath + '/' + sessionId;
                        let value = JSON.stringify(collaborations[sessionId]['cachedChangeEvents']);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }
            }
        });

        function forwardEvents(socketId, eventName, dataString) {
            let sessionId = socketIdToSessionId[socketId];

            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socketId != participants[i]) {
                        // console.log('send change.');
                        io.to(participants[i]).emit(eventName, dataString);
                    }
                }
            }
            else {
                console.log('WARNING: could not tie socket id to any collaborations');
            }
        }

    });
};

