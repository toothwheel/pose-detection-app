// Replace with your Teachable Machine model URL
const modelURL = "https://teachablemachine.withgoogle.com/models/QhLCo2482/";

// DOM elements
const screen = document.getElementById("screen");
const webcam = document.getElementById("webcam");
const feedback = document.getElementById("feedback"); // Add a new element for feedback

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

    // Get the predicted class and confidence score
    const poseClass = prediction[0].className;
    const confidence = prediction[0].probability.toFixed(2); // Round to 2 decimal places

    // Update the screen color based on the pose
    if (poseClass === "Blue") {
      screen.style.backgroundColor = "blue";
      screen.textContent = "Blue Screen";
    } else if (poseClass === "Red") {
      screen.style.backgroundColor = "red";
      screen.textContent = "Red Screen";
    }

    // Display the predicted class and confidence score
    feedback.textContent = `Pose: ${poseClass}, Confidence: ${confidence}`;

    // Repeat the prediction
    requestAnimationFrame(() => predictPose(model));
  } catch (error) {
    console.error("Error predicting pose: ", error);
    feedback.textContent = "Error predicting pose. Please try again.";
  }
}

// Initialize the app
init();
