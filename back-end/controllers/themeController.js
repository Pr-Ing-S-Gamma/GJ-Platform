  const jwt = require('jsonwebtoken');
  const mongoose = require('mongoose');
  const Theme = require("../models/themeModel");
  const Submission = require("../models/submissionModel")
  const GlobalOrganizer = require("../models/globalOrganizerModel")

  const createTheme = async (req, res) => {
    try {
      const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }

      let creatorUser = await GlobalOrganizer.findById(userId);

      if (!creatorUser) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }

      const { name } = req.body;
      if (!Theme.findOne({ name: name })) {
        return res.status(400).json({ success: false, error: 'El tema ya está registrado' });
      }

      const tema = new Theme({
        manualPT: req.body.manualPT,
        manualSP: req.body.manualSP,
        manualEN: req.body.manualEN,
        descriptionSP: req.body.descriptionSP,
        descriptionPT: req.body.descriptionPT,
        descriptionEN: req.body.descriptionEN,
        titleSP: req.body.titleSP,
        titleEN: req.body.titleEN,
        titlePT: req.body.titlePT,
        creatorUser: {
          userId: creatorUser._id,
          name: creatorUser.name,
          email: creatorUser.email,
        },
        creationDate: new Date(),
      });

      await tema.save();

      res.status(201).json({ success: true, message: 'Se ha creado correctamente el tema', theme: tema });
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Token inválido' });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  };


  const getTheme = async (req, res) => {
    try {
      const temaId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(temaId)) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' });
      }
      const tema = await Theme.findById(temaId);

      if (!tema) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' });
      }
      return res.status(200).json({ success: true, message: 'Tema encontrado correctamente', theme: tema });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  const getThemes = async (req, res) => {
    try {
      const temas = await Theme.find({});
      return res.status(200).json({ success: true, themes: temas });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  const updateTheme = async (req, res) => {
    try {
      const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      const temaId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(temaId)) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' });
      }
      const tema = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json({ success: true, message: 'Actualizado con éxito', theme: tema });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  const deleteTheme = async (req, res) => {
    try {
      const theme = await Theme.findByIdAndRemove(req.params.id);

      if (!theme) {
        return res.status(404).json({ success: false, message: 'Tema no encontrado' });
      }

      return res.status(200).json({ success: true, message: 'Tema eliminado correctamente' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  const getGamesPerTheme = async (req, res) => {
    const themeId = req.params.id;
      try {
          const submissions = await Submission.find({ theme: themeId })
              .populate('team')
              .populate('category')
              .populate('stage')
              .populate('game')
              .populate('theme')
          return res.status(200).json({ success: true, data: submissions });
      } catch (error) {
          res.status(500).json({ error: 'Error interno del servidor' });
      }
  }

  module.exports = {
    createTheme,
    deleteTheme,
    updateTheme,
    getTheme,
    getThemes,
    getGamesPerTheme
  };