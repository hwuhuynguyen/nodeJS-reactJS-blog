import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/context";

const ProfileForm = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    if (!user) navigate("/auth/login");

    setName(user.name);
    setGender(user.gender);
    setDateOfBirth(user.dateOfBirth);
    setFile(user.file);
  }, [user, navigate]);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const updateUser = {
      id: user.id,
      name,
      gender,
      dateOfBirth,
    };

    // Create a FormData object
    const formData = new FormData();

    // Append the image file
    if (file) {
      console.log("FILE: ", file.name);
      const filename = file.name;
      formData.append("fileName", filename);
      formData.append("profilePicture", file);
      updateUser.profilePicture = filename;
    }

    // Append additional data to FormData
    formData.append("name", updateUser.name);
    formData.append("gender", updateUser.gender);
    formData.append("dateOfBirth", updateUser.dateOfBirth);

    const jwt = localStorage.getItem("jwt");
    console.log(formData);
    console.log(updateUser);

    // Display the values
    for (const value of formData.values()) {
      console.log("Form values: ", value);
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${user.id}`,
        {
          method: "PATCH",
          body: formData, // Use the FormData object
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      );

      if (response.ok) {
        console.log("Form submitted successfully");
        const data = await response.json();
        console.log(data.data[0]);

        const newUser = data.data[0];
        authCtx.dispatch({type:"UPDATE_USER", payload: (newUser)});
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        console.error("Form submission failed");
        console.log(response);
      }
      navigate('/about');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="row py-4">
      <div className="col-8">
        <form
          id="userProfileForm"
          encType="multipart/form-data"
          onSubmit={handleSubmitForm}
        >
          <div className="modal-body">
            <input type="hidden" id="dateOfBirthRaw" value={dateOfBirth} />
            <input type="hidden" id="userId" value="<%= user.id %>" />

            <div className="form-group">
              <label htmlFor="name1">Name</label>
              <input
                type="text"
                className="form-control"
                id="name1"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender1">Gender</label>
              <select
                name="gender"
                id="gender1"
                className="form-control"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth1">Date of birth</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth1"
                name="dateOfBirth"
                value={formatDate(dateOfBirth)}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="profilePicture1">Profile picture</label>
              <input
                type="file"
                className="form-control"
                id="profilePicture1"
                name="profilePicture"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
          </div>
          <div className="modal-footer border-top-0 d-flex justify-content-center mt-3">
            <Link to={"./.."}>
              <button className="btn btn-primary me-3">
                Back to dashboard
              </button>
            </Link>
            <button type="submit" className="btn btn-warning">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
