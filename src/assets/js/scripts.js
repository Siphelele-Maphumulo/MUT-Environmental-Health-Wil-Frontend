function searchLogs() {
    const date = document.getElementById('searchDate').value;
    
    fetch(`php/fetch_logs.php?searchDate=${date}`)
        .then(response => response.json())
        .then(data => {
            let html = '<table class="table table-striped"><thead><tr><th>Student</th><th>Date</th><th>Details</th></tr></thead><tbody>';
            data.forEach(log => {
                html += `<tr><td>${log.username}</td><td>${log.date}</td><td>${log.details}</td></tr>`;
            });
            html += '</tbody></table>';
            document.getElementById('logResults').innerHTML = html;
        })
        .catch(error => console.error('Error:', error));
}
