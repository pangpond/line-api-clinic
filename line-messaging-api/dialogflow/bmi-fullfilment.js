// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function welcome(agent) {
      agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    function bodyMassIndex(agent) {
      let weight = request.body.queryResult.parameters.weight;
      let height = request.body.queryResult.parameters.height / 100;
      let bmi = (weight / (height * height)).toFixed(2);
      let result = "ข้อมูลไม่ถูกต้อง";
      if (bmi < 18.5) {
        result = "คุณผอมเกินไป";
      } else if (bmi < 23) {
        result = "หุ่นกำลังดีเลย";
      } else if (bmi < 25) {
        result = "เริ่มท้วมละนะ";
      } else if (bmi < 30) {
        result = "คุณอ้วนแล้ว ออกกำลังกายบ้าง";
      } else {
        result = "คุณอ้วนเกินไปแล้ว";
      }

      //const payloadJson = {};
      //const payload = new Payload('LINE', payloadJson, { sendAsMessage: true });
      //agent.add(payload);

      agent.add(result);
    }

    let intentMap = new Map();
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);

    intentMap.set("bmi-intent - custom - yes", bodyMassIndex);

    agent.handleRequest(intentMap);
  }
);
