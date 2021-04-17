import ProfileModal from "../models/Profile.js";
import CompetitiveModal from "../models/CompetitiveSkill.js";

const checkValidation = (profile) => {
  const errorObj = {};
  if (profile && profile.name.trim() === "") {
    errorObj["name"] = "Required";
  }
  if (profile && profile.Image.trim() === "") {
    errorObj["Image"] = "Required";
  }
  if (profile && profile.location.trim() === "") {
    errorObj["location"] = "Required";
  }
  if (profile && profile.education.trim() === "") {
    errorObj["education"] = "Required";
  }
  if (profile && +profile.challengesSolved < 0) {
    errorObj["challengesSolved"] = "Invalid";
  }
  if (profile && +profile.solutionSubmitted < 0) {
    errorObj["solutionSubmitted"] = "Invalid";
  }
  if (profile && +profile.solutionAccepted < 0) {
    errorObj["solutionAccepted"] = "Invalid";
  }
  if (profile && +profile.followers < 0) {
    errorObj["followers"] = "Invalid";
  }
  if (profile && +profile.following < 0) {
    errorObj["following"] = "Invalid";
  }
  if (profile && +profile.rank < 0) {
    errorObj["rank"] = "Invalid";
  }
  if (profile && +profile.vote < 0) {
    errorObj["vote"] = "Invalid";
  }
  if (profile && profile.device.trim() === "") {
    errorObj["device"] = "Required";
  }

  if (profile && +profile.dataStructures < 0) {
    errorObj["dataStructures"] = "Invalid";
  }
  if (profile && +profile.algorithms < 0) {
    errorObj["algorithms"] = "Invalid";
  }
  if (profile && +profile.html < 0) {
    errorObj["html"] = "Invalid";
  }
  if (profile && +profile.java < 0) {
    errorObj["java"] = "Invalid";
  }
  if (profile && +profile.js < 0) {
    errorObj["js"] = "Invalid";
  }
  if (profile && +profile.cpp < 0) {
    errorObj["cpp"] = "Invalid";
  }
  if (profile && +profile.python < 0) {
    errorObj["python"] = "Invalid";
  }
  return errorObj;
};

export const getProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModal.find().sort({ name: 1, rank: 1 });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
};

export const getProfileDetail = async (req, res) => {
  try {
    const profileDetail = await await ProfileModal.findOne({
      _id: req.params.id,
    })
      .select("-createdAt -_id -__v")
      .populate({ path: "competitiveSkills", select: "-_id -__v" });
    res.status(200).json(profileDetail);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
};

export const createProfile = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const profile = req.body;
  const errorObj = checkValidation(profile);
  if (Object.keys(errorObj).length > 0) {
    return res.status(400).json(errorObj);
  }
  const competitiveSkills = {
    ds: profile.dataStructures,
    algorithms: profile.algorithms,
    cpp: profile.cpp,
    java: profile.java,
    js: profile.js,
    html: profile.html,
    python: profile.python,
  };
  const profileDetails = {
    name: profile.name,
    Image: profile.Image,
    location: profile.location,
    education: profile.education,
    challengesSolved: profile.challengesSolved,
    solutionSubmitted: profile.solutionSubmitted,
    solutionAccepted: profile.solutionAccepted,
    rank: profile.rank,
    vote: profile.vote,
    followers: profile.followers,
    following: profile.following,
    device: profile.device,
  };
  try {
    const newCompetitiveSkills = await CompetitiveModal.create(
      competitiveSkills
    );
    console.log(newCompetitiveSkills);
    const newProfile = await ProfileModal.create({
      ...profileDetails,
      competitiveSkills: newCompetitiveSkills,
    });
    res.status(201).send(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const { id: _id } = req.params;
  const profile = req.body;
  const errorObj = checkValidation(profile);
  if (Object.keys(errorObj).length > 0) {
    return res.status(400).json(errorObj);
  }
  const competitiveSkills = {
    ds: profile.dataStructures,
    algorithms: profile.algorithms,
    cpp: profile.cpp,
    java: profile.java,
    js: profile.js,
    html: profile.html,
    python: profile.python,
  };
  const profileDetails = {
    name: profile.name,
    Image: profile.Image,
    location: profile.location,
    education: profile.education,
    challengesSolved: profile.challengesSolved,
    solutionSubmitted: profile.solutionSubmitted,
    solutionAccepted: profile.solutionAccepted,
    rank: profile.rank,
    vote: profile.vote,
    followers: profile.followers,
    following: profile.following,
    device: profile.device,
  };
  try {
    const profileTobeUpdated = await ProfileModal.findOne({ _id });
    if (profileTobeUpdated) {
      const updateSkills = await CompetitiveModal.findByIdAndUpdate(
        profileTobeUpdated.competitiveSkills,
        competitiveSkills,
        { new: true }
      );
      const updatedProfile = await ProfileModal.findByIdAndUpdate(
        _id,
        {
          ...profileDetails,
          competitiveSkills: updateSkills,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedProfile);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "update not successful" });
  }
};

export const deleteProfile = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const { id } = req.params;
  try {
    const isProfileFound = await ProfileModal.findOne({ _id: id });
    if (isProfileFound) {
      await CompetitiveModal.findByIdAndDelete(
        isProfileFound.competitiveSkills
      );
      await ProfileModal.findByIdAndDelete(id);
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "delete not successful" });
  }
};
