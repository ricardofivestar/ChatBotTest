//=========================================================
// Bot Setup
//=========================================================

var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');

//http Setup

http.createServer(function (req, res) {
    console.log('Got request for ' + req.url);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Hello Code and Azure Web Apps!</h1>');
}).listen(process.env.PORT);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
//  Create chat bot
var connector = new builder.ChatConnector({
    appId: '',      //Important for later
    appPassword: '' //Important for later
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var intents = new builder.IntentDialog();

//=========================================================
// Building The Bot 
//=========================================================

//===========
//BOT ACTIONS
//===========

bot.beginDialogAction('userLogin', '/userLogin');
bot.beginDialogAction('help', '/help');
bot.beginDialogAction('goBack', '/start');
bot.beginDialogAction("showStrategies", '/showStrategies');
bot.beginDialogAction('viewStrategy', '/viewStrategy');
bot.beginDialogAction('showChart', '/showChart');
bot.beginDialogAction('buyStrategy', '/buyStrategy');
bot.beginDialogAction('infoManager', '/infoManager');

//==============
//STARTING POINT
//==============
bot.dialog('/', intents)

intents.matches(/^Hi/i,
    function(session) {
        session.beginDialog('/start');
        session.endDialog();
});

bot.dialog('/start', 
    function(session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .images([
                        builder.CardImage.create(session, "https://static.pexels.com/photos/33972/pexels-photo.jpg")
                    ])
                    .title("fivestarbroker")
                    .text("The first social trading platform for bank API's")
                    .buttons([
                        builder.CardAction.dialogAction(session, 'userLogin', "", "Client Log In"),
                        builder.CardAction.dialogAction(session, 'help', "", "How to use")
                    ])
            ]);
        bot.send(msg);
        session.endDialog();
    }
);

//==============
//HOW TO USE
//==============

bot.dialog('/help', [
    function(session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .images([
                    builder.CardImage.create(session, "https://static.pexels.com/photos/106344/pexels-photo-106344.jpeg")
                ])
                .text("Here is an explination of how to use our chatbot")
                .buttons([
                    builder.CardAction.dialogAction(session, 'goBack', "", "go back")
                ])
            ]);
        session.send(msg);
        session.endDialog();
    }
]);

//==============
//LOGIN PROCESS 
//==============

bot.dialog('/userLogin', [
    function (session) {
        session.sendTyping(); //something to use when database queries are being executed 
        builder.Prompts.text(session, "What is your fivestarbroker username?");
    },
    function(session, results) {
        session.privateConversationData.name = results.response;
        session.send("Hello %s!", session.privateConversationData.name);
        session.beginDialog('/recommendation');
        session.endDialog();
    }
]);

//==============
//RECOMMENDATION
//==============

bot.dialog('/recommendation', [
    function (session, next){
        session.send("%s, I have noticed that you have 5.000 Euros that aren't invested in any Strategy.", session.privateConversationData.name);
        session.send("Based on your risk disposition I would recommend that you invest your capital in \"Best of DAX and MDAX\"");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .title("Best Of DAX And MDAX")
                .buttons([
                    builder.CardAction.dialogAction(session, 'showChart', "", "View Chart"),            
                    builder.CardAction.dialogAction(session, 'infoManager', "", "Information about manager"),
                    builder.CardAction.dialogAction(session, 'buyStrategy', "", "Buy"),
                    builder.CardAction.dialogAction(session, 'showStrategies', "", "View Your Strategies")                  
                ])
            ])
        session.send(msg);
    }
]);

//===============
//SHOW STRATEGIES
//===============

bot.dialog('/showStrategies', [
    function (session){ //Seems like it only works on facebook. TEST ON FACEBOOK!!
        session.send("Here is an overview over all your strategies!");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .title("Strategy Name")
                .subtitle("Strategy Description")
                .buttons([
                    builder.CardAction.dialogAction(session, 'viewStrategy', "", "View Strategy"),//Define Action
                    builder.CardAction.dialogAction(session, 'goBack', "", "Buy"),  //Define Action
                    builder.CardAction.dialogAction(session, 'goBack', "", "Sell")          //Define Action   
                ])
            ])

        session.send(msg);

        // msg= new builder.Message(session)    
        //     .sourceEvent({
        //         facebook: {
        //             attachments: {
        //                 type: "template",
        //                 payload: {
        //                     "template-type": "generic",
        //                     "elements": [
        //                         {
        //                            "title": "Strategy Name",
        //                             //"item_url": "url missing",
        //                             //"image_url": "http://www.mariposacap.com/wp-content/uploads/2010/09/log-chart.png",
        //                             "subtitle": "Strategy Description",
        //                             "buttons": [
        //                                 {
        //                                     "type": "web-url",
        //                                     "url": "",
        //                                     "title": "View Strategy"
        //                                 },
        //                                 {
        //                                     "type": "web-url",
        //                                     "url": "",
        //                                     "title": "View Recent History"
        //                                 }
        //                             ]
        //                         },
        //                         {
        //                             "title": "Strategy Name",
        //                             //"item_url": "url missing",
        //                             //"image_url": "http://www.mariposacap.com/wp-content/uploads/2010/09/log-chart.png",
        //                             "subtitle": "Strategy Description",
        //                             "buttons": [
        //                                 {
        //                                     "type": "web-url",
        //                                     "url": "",
        //                                     "title": "View Strategy"
        //                                 },
        //                                 {
        //                                     "type": "web-url",
        //                                     "url": "",
        //                                     "title": "View Recent History"
        //                                 }
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             }
        //         }
        //     })

        session.endDialog();
    }
]);

//=============
//VIEW STRATEGY
//=============

bot.dialog('/viewStrategy',
    function(session){
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .title('Strategy Name')
                .images([
                    builder.CardImage.create(session, "https://image.shutterstock.com/z/stock-photo-display-of-stock-market-quotes-stock-market-chart-business-graph-background-forex-trading-425113042.jpg")
                ])
                .subtitle("Recent Comment Of Investor")
                .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.")
            ])
        session.send(msg);
        session.endDialog();
    }
);

//============
//USER REQUEST
//============

intents.matches(/^TechStocks/i, 
    function (session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .title("TechStocks")
                .buttons([
                    builder.CardAction.dialogAction(session, 'showChart', "", "View Chart"),            
                    builder.CardAction.dialogAction(session, 'infoManager', "", "Information about manager"),
                    builder.CardAction.dialogAction(session, 'buyStrategy', "", "Buy")                  
                ])
            ])
        session.send(msg)
});

//============
//SHOW CHART
//============

bot.dialog('/showChart', 
    function (session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .images([
                    builder.CardImage.create(session, "https://image.shutterstock.com/z/stock-photo-digital-commodity-data-analyzing-in-commodities-market-trading-the-charts-and-summary-info-for-422591503.jpg")
                ])
            ])
        session.send(msg);
        session.endDialog();
    }
);

//==================
//INFO ABOUT MANAGER
//==================

bot.dialog('/infoManager',
    function (session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                .images([
                    builder.CardImage.create(session, "http://combiboilersleeds.com/images/peter-lynch/peter-lynch-2.jpg")
                ])
                .title("Peter Lynch")
                .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")
            ])
        session.send(msg);
        session.endDialog();
    }
)

//============
//BUY STRATEGY
//============

bot.dialog('/buyStrategy', [
    function(session) {
        builder.Prompts.number(session, "How much money would you like to invest?")
    },
    function(session, results) {
        session.privateConversationData.amount = results.response;
        builder.Prompts.choice(session, "Choose your broker", ["flatex", "ViTrade", "..."])
    },
    function(session, results) {
        session.privateConversationData.broker = results.response;
        session.send("Investing %s Euros through %s in TechStocks", session.privateConversationData.amount, session.privateConversationData.broker.entity);
        builder.Prompts.confirm(session, "Should I execute this order?");
    }, 
    function(session, results) {
        if(results.response === true) {
            session.send("Perfect! I will execute the order.");
            session.beginDialog('/receipt');
            session.endDialog();
        } else {
            session.send("I won't execute the order!");
            session.beginDialog('/rejection')
        }
    }
]);

//========================
//RESPONSE AFTER REJECTION
//========================

bot.dialog('/rejection', [
    function(session) {
        builder.Prompts.choice(session, "What would you like to do next?", ["View Strategies", "Log Out", "..."])
    },
    function(session, results) {
        if(results.response.entity === "View Strategies") {
            session.beginDialog('/showStrategies');
        } else if (results.response.entity === "Log Out") {
            session.send("Alright. I hope to see you again soon!");
        }
        session.endDialog();
    }
]);


//====================
//RECEIPT FOR PURCHASE
//====================

bot.dialog('/receipt',
    function(session, results) {
        session.sendTyping();
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                .title("Receipt Name")
                .facts([
                builder.Fact.create(session, '1234', 'Order Number'),
                builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
                ])
                .items([
                    builder.ReceiptItem.create(session, session.privateConversationData.amount, "Menge") 
                        .quantity(720)
                        .image(builder.CardImage.create(session, "https://static.pexels.com/photos/90787/pexels-photo-90787.jpeg"))
                ])
                .tax("-")
                .total(session.privateConversationData.amount)
            ])
        session.send(msg);
    }
);