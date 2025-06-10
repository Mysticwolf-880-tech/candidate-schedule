
const express = require("express");
const cors = require("cors");
const path = require("path");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const interviewers = require("./routes/interviewers");
const jobPositionRoutes = require("./routes/JobPositions");
const status = require("./routes/status");
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();
const port = 5000;


app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true,                
}));

app.use(bodyParser.json());
app.use(cookieParser());


app.use("/", authRoutes);
app.use('/', interviewers);
app.use('/', jobPositionRoutes);
app.use('/', status);
app.use('/', candidateRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});