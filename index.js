const express = require("express")
const Expo = require("expo-server-sdk").default
const cors = require("cors")

const expo = new Expo()
const expressServer = express();

expressServer.use(cors())
expressServer.listen(process.env.PORT || 3000, () => {
    // url/?token=[token]
    expressServer.get('/', function(request, response) {
        const token = request.query.token;
        if (!Expo.isExpoPushToken(token)) {
            response.send({err: "Token invalide"})
        } else {
            // Tableau de multiples messages, chacun destiné à un token qui correspond à un téléphone
            let messages = [
                {
                    to: token,
                    sound: "default",
                    body: "Notification TEST",
                    data: {test: "azerty"}
                }
            ]

            expo.sendPushNotificationsAsync(messages).then(ticket => {
                response.send({ticket: ticket})
            }).catch(err => {
                console.log("Erreur d'envoi");
                response.send({err: "Erreur d'envoi"})
            })
        }
    })
})