// Replace with your Teachable Machine model URL -
const modelURL = "https://teachablemachine.withgoogle.com/models/WPZcydTx7/";

// Replace with your Teachable Machine model URL
const modelURL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/";

// DOM elements
const screen = document.getElementById("screen");
const webcam = document.getElementById("webcam");

// Load the model and start the webcam
async function init() {
  try {
    // Load the Teachable Machine model
    const model = await tmPose.load(modelURL + "model.json", modelURL + "metadata.json");
    console.log("Model loaded successfully!");

    // Start the webcam
    await startWebcam();

    // Wait for the webcam feed to load data
    await waitForWebcamData();

    // Start predicting poses
    predictPose(model);
  } catch (error) {
    console.error("Error initializing app: ", error);
  }
}

// Start the webcam
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    webcam.srcObject = stream;
    console.log("Webcam access granted!");
  } catch (error) {
    console.error("Error accessing webcam: ", error);
    alert("Unable to access webcam. Please ensure your camera is connected and permissions are granted.");
  }
}

// Wait for the webcam feed to load data
function waitForWebcamData() {
  return new Promise((resolve) => {
    webcam.addEventListener("loadeddata", () => {
      console.log("Webcam data loaded!");
      resolve();
    });
  });
}

// Predict the pose and update the screen color
async function predictPose(model) {
  try {
    // Get the pose estimation from the webcam
    const { pose, posenetOutput } = await model.estimatePose(webcam);

    // Predict the pose class
    const prediction = await model.predict(posenetOutput);

    // Get the predicted class
    const poseClass = prediction[0].className;

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
  } catch (error) {
    console.error("Error predicting pose: ", error);
  }
}

// Initialize the app
init();
