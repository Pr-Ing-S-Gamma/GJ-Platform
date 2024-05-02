const Submission = require('../models/submissionModel');
const Stage = require('../models/stageModel');
const Category = require('../models/categoryModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Theme = require('../models/themeModel')

const createSubmission = async (req, res) => {
    const { description, pitch, game, teamId, categoryId, stageId, themeId, title } = req.body;
    try {
        const currentDate = new Date();

        if (!mongoose.Types.ObjectId.isValid(stageId)) {
            return res.status(400).json({ success: false, error: 'The provided stage ID is not valid.' });
        }

        const existingStage = await Stage.findById(stageId);
        if (!existingStage) {
            return res.status(404).json({ success: false, error: "That stage doesn't exist" });
        }

        if (currentDate < existingStage.startDate || currentDate > existingStage.endDate) {
            return res.status(400).json({ success: false, error: 'The current date is outside the allowed range for this stage.' });
        }

        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);

        let existingTeam;
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ success: false, error: 'The provided team ID is not valid.' });
        } else {
            existingTeam = await Team.findById(teamId);
            if (!existingTeam) {
                return res.status(404).json({ success: false, error: "That team doesn't exist" });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, error: 'The provided category ID is not valid.' });
        } else {
            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                return res.status(404).json({ success: false, error: "That category doesn't exist" });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(themeId)) {
            return res.status(400).json({ success: false, error: 'The provided theme ID is not valid.' });
        } else {
            const existingCategory = await Theme.findById(themeId);
            if (!existingCategory) {
                return res.status(404).json({ success: false, error: "That theme doesn't exist" });
            }
        }

        const submission = new Submission({
            title: title,
            description: description,
            pitch: pitch,
            game: game,
            teamId: teamId,
            categoryId: categoryId,
            stageId: stageId,
            themeId: themeId,
            score: 0,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await submission.save();

        existingTeam.submissions.push(submission._id);
        await existingTeam.save();

        existingTeam.lastSub = submission._id;
        await existingTeam.save();

        res.status(200).json({ success: true, msg: 'Submission created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateSubmission = async (req, res) => {
    try {
        const { description, pitch, game, teamId, categoryId, themeId, stageId, title } = req.body;
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        const existingSubmission = await Submission.findById(id);
        let changed = 0;

        const currentDate = new Date();

        if (!mongoose.Types.ObjectId.isValid(stageId)) {
            return res.status(400).json({ success: false, error: 'The provided stage ID is not valid.' });
        }

        const existingStage = await Stage.findById(stageId);
        if (!existingStage) {
            return res.status(404).json({ success: false, error: "That stage doesn't exist" });
        }

        if (currentDate < existingStage.startDate || currentDate > existingStage.endDate) {
            return res.status(400).json({ success: false, error: 'The current date is outside the allowed range for this stage.' });
        }

        if (description) {
            updateFields.description = description;
            changed++;
        }

        if (title) {
            updateFields.title = title;
            changed++;
        }

        if (pitch) {
            updateFields.pitch = pitch;
            changed++;
        }

        if (game) {
            updateFields.game = game;
            changed++;
        }

        if (teamId) {
            if (!mongoose.Types.ObjectId.isValid(teamId)) {
                return res.status(400).json({ success: false, error: 'The provided team ID is not valid.' });
            } else {
                const existingTeam = await Team.findById(teamId);
                if (!existingTeam) {
                    return res.status(404).json({ success: false, error: "That team doesn't exist" });
                }
            }
            await Team.updateOne(
                { _id: existingSubmission.gameJam },
                { $pull: { submissions: existingSubmission._id } }
            );
            await Team.updateOne(
                { _id: req.body.gameJamId },
                { $addToSet: { submissions: existingSubmission._id } }
            );

            updateFields.teamId = teamId;
            changed++;
        }

        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ success: false, error: 'The provided category ID is not valid.' });
            } else {
                const existingCategory = await Category.findById(categoryId);
                if (!existingCategory) {
                    return res.status(404).json({ success: false, error: "That category doesn't exist" });
                }
            }
            updateFields.categoryId = categoryId;
            changed++;
        }

        if (themeId) {
            if (!mongoose.Types.ObjectId.isValid(themeId)) {
                return res.status(400).json({ success: false, error: 'The provided Theme ID is not valid.' });
            } else {
                const existingTheme = await Theme.findById(themeId);
                if (!existingTheme) {
                    return res.status(404).json({ success: false, error: "That theme doesn't exist" });
                }
            }
            updateFields.themeId = themeId;
            changed++;
        }

        if (stageId) {
            if (!mongoose.Types.ObjectId.isValid(stageId)) {
                return res.status(400).json({ success: false, error: 'The provided stage ID is not valid.' });
            } else {
                const existingStage = await Stage.findById(stageId);
                if (!existingStage) {
                    return res.status(404).json({ success: false, error: "That stage doesn't exist" });
                }
            }
            updateFields.stageId = stageId;
            changed++;
        }

        if (changed > 0) {
            updateFields.lastUpdateUser = {
                userId: lastUpdateUser._id,
                name: lastUpdateUser.name,
                email: lastUpdateUser.email
            };
            updateFields.lastUpdateDate = new Date();
        }
        await Submission.findByIdAndUpdate(id, updateFields);

        res.status(200).send({ success: true, msg: 'Submission updated successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getCurrentTeamSubmission = async (req, res) => {
    const { teamId, stageId } = req.params;

    try {
        const selectedSubmission = await Submission.findOne({ teamId: teamId, stageId: stageId });

        if (!selectedSubmission) {
            return res.status(404).json({ success: false, error: 'No submission found for the specified team and stage.' });
        }

        res.status(200).json({ success: true, msg: 'Submission found successfully.', data: selectedSubmission });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Error processing the request.' });
    }
};

const getSubmission = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de entrega proporcionado no es válido.' });
        } else {
            const existingSubmission = await Submission.findById(id);
            if (!existingSubmission) {
                return res.status(404).json({ success: false, error: "Esa entrega no existe" });
            }
        }
        const selectedSubmission = await Submission.findById(id);
        res.status(200).send({ success: true, msg: 'Entrega encontrada correctamente', data: selectedSubmission });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const allSubmissions = await Submission.find({});
        res.status(200).send({ success: true, msg: 'Se han encontrado entregas en el sistema', data: allSubmissions });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const deleteSubmission = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedSubmission = await Submission.findOneAndDelete({ _id: id });

        if (deletedSubmission) {
            await Team.updateOne({ _id: deletedSubmission.team }, { $pull: { submissions: deletedSubmission._id } });

            res.status(200).send({ success: true, msg: 'Entrega eliminada correctamente', data: deletedSubmission });
        } else {
            res.status(404).json({ success: false, error: 'No se encontró la entrega con el ID proporcionado' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const giveRating = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized' });
        }

        const { submissionId, generalFeedback,
            pitchScore, pitchFeedback,
            gameDesignScore, gameDesignFeedback,
            artScore, artFeedback,
            buildScore, buildFeedback,
            audioScore, audioFeedback,
        } = req.body;

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ message: 'El submission no fue encontrado.' });
        }

        let evaluator = null;
        const evaluatorss = submission.evaluators;
        for (const e of evaluatorss) {
            if (e.userId == userId) {
                evaluator = e;
                break; 
            }
        }

        if (evaluator == null) {
            return res.status(404).json({ message: 'Este juego no está asignado al usuario juez actual.' });
        }



        evaluator.pitchScore = pitchScore;
        evaluator.pitchFeedback = pitchFeedback;
        evaluator.gameDesignScore = gameDesignScore;
        evaluator.gameDesignFeedback = gameDesignFeedback;
        evaluator.artScore = artScore;
        evaluator.artFeedback = artFeedback;
        evaluator.buildScore = buildScore;
        evaluator.buildFeedback = buildFeedback;
        evaluator.audioScore = audioScore;
        evaluator.audioFeedback = audioFeedback;
        evaluator.generalFeedback = generalFeedback;

        await submission.save();

        res.status(200).json({ success: true, msg: 'Juego calificado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}

const getRating = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized' });
        }

        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'El submission no fue encontrado.' });
        }

        const evaluator = submission.evaluators.find(evaluator => evaluator.userId === userId);
        if (!evaluator) {
            return res.status(404).json({ message: 'Este juego no está asignado al usuario juez actual.' });
        }

        const response = {
            pitchScore: evaluator.pitchScore,
            pitchFeedback: evaluator.pitchFeedback,
            gameDesignScore: evaluator.gameDesignScore,
            gameDesignFeedback: evaluator.gameDesignFeedback,
            artScore: evaluator.artScore,
            artFeedback: evaluator.artFeedback,
            buildScore: evaluator.buildScore,
            buildFeedback: evaluator.buildFeedback,
            audioScore: evaluator.audioScore,
            audioFeedback: evaluator.audioFeedback,
            generalFeedback: evaluator.generalFeedback
        }

        res.status(200).send({ success: true, msg: 'Rating encontrado correctamente', data: response });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const setSubmissionScore = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized' });
        }

        const { id, score } = req.body;

        if (!id || !score) {
            return res.status(400).json({ success: false, msg: 'Missing submission ID or score' });
        }

        const existingSubmission = await Submission.findById(id);

        if (!existingSubmission) {
            return res.status(404).json({ success: false, msg: 'Submission not found' });
        }

        const team = await Team.findById(existingSubmission.team);

        if (!team) {
            return res.status(404).json({ success: false, msg: 'Team not found' });
        }

        const promises = [];

        for (const jammer of team.jammers) {
            const updatedSubmission = await Submission.findByIdAndUpdate(id, { score }, { new: true });

            const subject = 'Score Update on GameJam Platform';
            const text = `Hi ${jammer.name}, your team's submission has been updated. New score: ${score}.`;

            const emailPromise = sendEmail(jammer.email, subject, text);
            promises.push(emailPromise);
        }

        await Promise.all(promises);

        res.status(200).json({ success: true, msg: 'Score set and emails sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};
const setEvaluatorToSubmission = async (req, res) => {
    try {

        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;


        const creatorUser = await User.findById(userId);
        if (!creatorUser) {
            return res.status(404).json({ message: 'El usuario no fue encontrado.' });
        }


        const { submissionId, evaluatorId, evaluatorName, evaluatorEmail } = req.body;


        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'El submission no fue encontrado.' });
        }

        const existingEvaluator = submission.evaluators.find(evaluator => evaluator.userId === evaluatorId);
        if (existingEvaluator) {
            return res.status(400).json({ message: 'El juez ya está asociado.' });
        }


        submission.evaluators.push({ userId: evaluatorId, name: evaluatorName, email: evaluatorEmail });
        await submission.save();

        res.status(200).json({ message: 'Evaluador agregado exitosamente a la presentación.' });
    } catch (error) {
        res.status(500).json({ message: 'Ocurrió un error' });
    }
};

const getSubmissionsEvaluator = async (req, res) => {
    try {
        const evaluatorID = req.params.id;
        const Submissions = await Submission.find({
            'evaluators.userId': evaluatorID,
            $or: [
            {"pitchScore": null},
            {"pitchFeedback": null},
            {"gameDesignScore": null},
            {"gameDesignFeedback": null},
            {"artScore": null},
            {"artFeedback": null},
            {"buildScore": null},
            {"buildFeedback": null},
            {"audioScore": null},
            {"audioFeedback": null},
            {"generalFeedback": null}]
        });


        res.status(200).send({ success: true, msg: 'Se han encontrado entregas en el sistema', data: Submissions });
    }
    catch {
        res.status(400).json({ success: false, error: 'Error while processing the request.' });
    }
};

const getRatingsEvaluator = async (req, res) => {
    try {
        const evaluatorID = req.params.id;
        const Submissions = await Submission.find({
            evaluators: {
                $elemMatch: {
                    userId: evaluatorID,
                    $or: [
                        { pitchScore: { $ne: 0, $ne: null, $ne: '' } },
                        { pitchFeedback: { $ne: null, $ne: '' } },
                        { gameDesignScore: { $ne: 0, $ne: null, $ne: '' } },
                        { gameDesignFeedback: { $ne: null, $ne: '' } },
                        { artScore: { $ne: 0, $ne: null, $ne: '' } },
                        { artFeedback: { $ne: null, $ne: '' } },
                        { buildScore: { $ne: 0, $ne: null, $ne: '' } },
                        { buildFeedback: { $ne: null, $ne: '' } },
                        { audioScore: { $ne: 0, $ne: null, $ne: '' } },
                        { audioFeedback: { $ne: null, $ne: '' } },
                        { generalFeedback: { $ne: null, $ne: '' } }
                    ]
                }
            }
        });
        res.status(200).send({ success: true, msg: 'Se han encontrado entregas en el sistema', data: Submissions });
    }
    catch {
        res.status(400).json({ success: false, error: 'Error processing the request.' });
    }
};


module.exports = {
    createSubmission,
    updateSubmission,
    getCurrentTeamSubmission,
    getSubmission,
    getSubmissions,
    deleteSubmission,
    setSubmissionScore,
    setEvaluatorToSubmission,
    giveRating,
    getRating,
    getSubmissionsEvaluator,
    getRatingsEvaluator
};