// Replace with your Teachable Machine model URL -
const modelURL = "https://teachablemachine.withgoogle.com/models/WPZcydTx7/";

// DOM elements
const screen = document.getElementById("screen");
const webcam = document.getElementById("webcam");

// Load the model and start the webcam
async function init() {
  const model = await tmPose.load(modelURL + "model.json", modelURL + "metadata.json");
  startWebcam();
  predictPose(model);
}

// Start the webcam
function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      webcam.srcObject = stream;
    })
    .catch((error) => {
      console.error("Error accessing webcam: ", error);
    });
}

// Predict the pose and update the screen color
async function predictPose(model) {
  const prediction = await model.predict(webcam);
  const poseClass = prediction[0].className; // Get the predicted class

  // Change the screen color based on the pose
  if (poseClass === "Pose1") {
    screen.style.backgroundColor = "blue";
    screen.textContent = "Blue Screen";
  } else if (poseClass === "Pose2") {
    screen.style.backgroundColor = "red";
    screen.textContent = "Red Screen";
  }

  // Repeat the prediction
  requestAnimationFrame(() => predictPose(model));
}

// Initialize the app
init();
