const apiBaseUrl = 'https://vvri.pythonanywhere.com/api';

function showCourses() {
    fetch(`${apiBaseUrl}/courses`)
        .then(response => response.json())
        .then(data => {
            let content = '<h2>Courses</h2>';
            content += '<button class="btn btn-primary" onclick="showCourseForm()">Create Course</button>';
            content += '<div id="courseForm" class="mt-3" style="display:none;">' +
                       '<input type="text" id="courseName" class="form-control mb-2" placeholder="Course Name">' +
                       '<button class="btn btn-success" onclick="createCourse()">Save</button></div>';
            content += '<table class="table table-striped mt-3"><thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead><tbody>';
            data.forEach(course => {
                content += `<tr>
                    <td>${course.id}</td>
                    <td>${course.name}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="showEditCourseForm(${course.id}, '${course.name}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCourse(${course.id})">Delete</button>
                    </td>
                </tr>`;
            });
            content += '</tbody></table>';
            document.getElementById('content').innerHTML = content;
        });
}

function showStudents() {
    fetch(`${apiBaseUrl}/students`)
        .then(response => response.json())
        .then(studentsData => {
            fetch(`${apiBaseUrl}/courses`)
                .then(response => response.json())
                .then(coursesData => {
                    let content = '<h2>Students</h2>';
                    content += '<button class="btn btn-primary" onclick="showStudentForm()">Create Student</button>';
                    content += '<div id="studentForm" class="mt-3" style="display:none;">' +
                               '<input type="text" id="studentName" class="form-control mb-2" placeholder="Student Name">' +
                               '<select id="courseSelect" class="form-control mb-2"></select>' +
                               '<button class="btn btn-success" onclick="createStudent()">Save</button></div>';
                    content += '<table class="table table-striped mt-3"><thead><tr><th>ID</th><th>Name</th><th>Course Name</th><th>Actions</th></tr></thead><tbody>';

                    studentsData.forEach(student => {
                        let courseName = 'No Course';
                        coursesData.forEach(course => {
                            const isStudentInCourse = course.students.find(s => s.id === student.id);
                            if (isStudentInCourse) {
                                courseName = course.name;
                            }
                        });

                        content += `<tr>
                            <td>${student.id}</td>
                            <td>${student.name}</td>
                            <td>${courseName}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="showEditStudentForm(${student.id}, '${student.name}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
                            </td>
                        </tr>`;
                    });
                    content += '</tbody></table>';
                    document.getElementById('content').innerHTML = content;

                    // Populate course select options
                    let courseSelect = document.getElementById('courseSelect');
                    coursesData.forEach(course => {
                        let option = document.createElement('option');
                        option.value = course.id;
                        option.text = course.name;
                        courseSelect.add(option);
                    });
                });
        });
}

function populateCourseSelect(selectedCourseId = null) {
    fetch(`${apiBaseUrl}/courses`)
        .then(response => response.json())
        .then(data => {
            const courseSelect = document.getElementById('courseSelect');
            courseSelect.innerHTML = '<option value="">Select Course</option>';
            data.forEach(course => {
                courseSelect.innerHTML += `<option value="${course.id}">${course.name}</option>`;
            });
            if (selectedCourseId) {
                courseSelect.value = selectedCourseId;
            }
        });
}

function showCourseForm() {
    document.getElementById('courseForm').style.display = 'block';
}

function showStudentForm() {
    document.getElementById('studentForm').style.display = 'block';
    populateCourseSelect();
}

function createCourse() {
    const name = document.getElementById('courseName').value;
    if (name) {
        fetch(`${apiBaseUrl}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        }).then(() => {
            document.getElementById('courseName').value = '';
            showCourses();
        });
    }
}

function showEditCourseForm(id, name) {
    document.getElementById('courseForm').style.display = 'block';
    document.getElementById('courseForm').innerHTML = 
        `<input type="text" id="courseName" value="${name}" placeholder="Course Name">
         <button onclick="editCourse(${id})">Save</button>`;
}

function editCourse(id) {
    const name = document.getElementById('courseName').value;
    if (name) {
        fetch(`${apiBaseUrl}/courses/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        }).then(() => {
            document.getElementById('courseName').value = '';
            showCourses();
        });
    }
}

function deleteCourse(id) {
    fetch(`${apiBaseUrl}/courses/${id}`, { method: 'DELETE' })
        .then(() => showCourses());
}

function createStudent() {
    const name = document.getElementById('studentName').value;
    const courseId = document.getElementById('courseSelect').value;
    if (name && courseId) {
        fetch(`${apiBaseUrl}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, course_id: courseId })
        }).then(() => {
            document.getElementById('studentName').value = '';
            document.getElementById('courseSelect').value = '';
            showStudents();
        });
    }
}

function showEditStudentForm(id, name, courseId) {
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('studentForm').innerHTML = 
        `<input type="text" id="studentName" value="${name}" placeholder="Student Name">
         <select id="courseSelect"></select>
         <button onclick="editStudent(${id})">Save</button>`;
    populateCourseSelect(courseId);
}

function editStudent(id) {
    const name = document.getElementById('studentName').value;
    const courseId = document.getElementById('courseSelect').value;
    if (name && courseId) {
        fetch(`${apiBaseUrl}/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, course_id: courseId })
        }).then(() => {
            document.getElementById('studentName').value = '';
            document.getElementById('courseSelect').value = '';
            showStudents();
        });
    }
}

function deleteStudent(id) {
    fetch(`${apiBaseUrl}/students/${id}`, { method: 'DELETE' })
        .then(() => showStudents());
}