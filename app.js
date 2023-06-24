const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

const gitlabUrl = 'https://gitlab.com'; // Replace with your GitLab instance URL
const projectId = '26965484'; // Replace with your GitLab project ID
const filePath = 'program_pages/seo_config/iiit-hyderabad.json'; // Replace with the path to your JSON file in the repository
const token = 'glpat-s56FyFvU6CqBxtxiPTcr'; // Replace with your GitLab personal access token

const apiUrl = `${gitlabUrl}/api/v4/projects/${encodeURIComponent(projectId)}/repository/files/${encodeURIComponent(filePath)}/raw`;

app.use(bodyParser.json());
// Endpoint for the homepage
app.get('/', (req, res) => {
    fs.readFile("/Users/eram/Desktop/json-project" + '/fourth.html', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading HTML file:', err);
          res.status(500).send('Error reading HTML file');
          return;
        }
    
        // Send the HTML code as the response
        res.send(data);
      });

  });
  
// Endpoint to fetch the JSON file from GitLab
app.get('/json', async (req, res) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'PRIVATE-TOKEN': token
      }
    });
    const jsonData = response.data;

    res.json(jsonData);
  } catch (error) {
    console.log("Failed to fetch json data from api");
    console.error('Error fetching JSON file:', error);
    res.status(500).json({ error: 'Failed to fetch JSON file' });
  }
});

app.post('/save', async (req, res) => {
  try {
    const jsonData = req.body;
    const content = JSON.stringify(jsonData, null, 2);
    const commitMessage = 'Update JSON file';

    const encodedContent = Buffer.from(content).toString('base64');

    await axios.put(apiUrl, {
      branch: 'master',
      commit_message: commitMessage,
      content: encodedContent
    }, {
      headers: {
        'PRIVATE-TOKEN': token
      }
    });
    console.log("FILE SAVED SUCCESSFULLY!");
    res.json({ message: 'JSON file saved successfully' });
    alert("SAVED");
  } catch (error) {
    console.error('Error saving JSON file:', error);
    res.status(500).json({ error: 'Failed to save JSON file' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
