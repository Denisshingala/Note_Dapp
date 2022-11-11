const NoteApp = artifacts.require("NoteApp");

module.exports = (deployer) => {
    deployer.deploy(NoteApp);
};