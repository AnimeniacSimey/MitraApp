import './Signup.css';
import { motion } from "framer-motion";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        careerpath: 'uncertain',
        about: '',
        skills: []
    });

    const [skillInput, setSkillInput] = useState("");

    const handleSkillKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const trimmedSkill = skillInput.trim();

            if (trimmedSkill === "") return;
            if (values.skills.length >= 3) return;
            if (values.skills.includes(trimmedSkill)) {
                setSkillInput("");
                return;
            }

            setValues({
                ...values,
                skills: [...values.skills, trimmedSkill]
            });

            setSkillInput("");
        }
    };

    const removeSkill = (indexToRemove) => {
        setValues({
            ...values,
            skills: values.skills.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const getPreciseLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                if (error.code === 1) {
                    reject("Location permission was denied.");
                } else if (error.code === 2) {
                    reject("Location information is unavailable.");
                } else if (error.code === 3) {
                    reject("Location request timed out.");
                } else {
                    reject("Unknown geolocation error.");
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    });
};
   const handleAll = async (e) => {
    e.preventDefault();

    const { firstname, lastname, gender, careerpath, about, skills } = values;

    let location;

    try {
        location = await getPreciseLocation();
        console.log("Location success:", location);
    } catch (err) {
        console.error("Geolocation error:", err);
        alert("We could not get your location. Please allow location access and try again.");
        return;
    }

    try {
        const res = await fetch('http://localhost:5010/add-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: firstname,
                last_name: lastname,
                gender,
                career: careerpath,
                abt: about,
                skills,
                lat: location.lat,
                lon: location.lon
            })
        });

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        console.log("User added:", data);

        navigate("/map");
    } catch (err) {
        console.error("Database / fetch error:", err);
        alert("Your location worked, but saving your profile failed.");
    }
};

    const handleReset = () => {
        setValues({
            firstname: '',
            lastname: '',
            gender: '',
            careerpath: 'uncertain',
            about: '',
            skills: []
        });
        setSkillInput("");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="container"
        >
            <h1>Mitra Sign Up</h1>

            <form onSubmit={handleAll}>
                <label htmlFor="firstname">First Name</label>
                <input
                    type="text"
                    placeholder="Enter First Name"
                    name="firstname"
                    value={values.firstname}
                    onChange={handleChanges}
                    required
                />

                <label htmlFor="lastname">Last Name</label>
                <input
                    type="text"
                    placeholder="Enter Last Name"
                    name="lastname"
                    value={values.lastname}
                    onChange={handleChanges}
                    required
                />

                <label className="gender-option">
                    <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={values.gender === "male"}
                        onChange={handleChanges}
                        required
                    /> Male
                </label>

                <label className="gender-option">
                    <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={values.gender === "female"}
                        onChange={handleChanges}
                    /> Female
                </label>

                <label className="gender-option">
                    <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={values.gender === "other"}
                        onChange={handleChanges}
                    /> Other
                </label>

                <label htmlFor="careerpath">Career Path</label>
                <select
                    name="careerpath"
                    id="careerpath"
                    value={values.careerpath}
                    onChange={handleChanges}
                >
                    <option value="uncertain">Uncertain</option>
                    <option value="backend">Backend Developer</option>
                    <option value="cybersecurityanalyst">Cybersecurity Analyst</option>
                    <option value="dataanalyst">Data Analyst</option>
                    <option value="test">Developer and Test Automater</option>
                    <option value="devops">Dev Ops</option>
                    <option value="itsupport">IT support</option>
                    <option value="frontend">Frontend Developer</option>
                    <option value="uxanalyst">UX Analyst</option>
                    <option value="other">Other</option>
                </select>

                <label htmlFor="about">About Me</label>
                <textarea
                    name="about"
                    id="about"
                    cols="30"
                    rows="10"
                    placeholder="Enter text"
                    maxLength={300}
                    value={values.about}
                    onChange={handleChanges}
                ></textarea>

                <label>Skills</label>
                <input
                    type="text"
                    placeholder={
                        values.skills.length < 3
                            ? `Type a skill and press Enter (${values.skills.length}/3)`
                            : "You have added 3 skills"
                    }
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    disabled={values.skills.length >= 3}
                />

                <div className="skills-list">
                    {values.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                            {skill}
                            <span
                                className="remove-btn"
                                onClick={() => removeSkill(index)}
                            >
                                x
                            </span>
                        </span>
                    ))}
                </div>

                <button type="button" onClick={handleReset}>Reset</button>
                <button type="submit">Submit</button>
            </form>
        </motion.div>
    );
}

export default Signup;