const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Theme = require("../models/teamModel");

const createTheme = async (req, res) => {
  try {
    const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }

    const creatorUser = await GlobalOrganizer.findById(userId);

    if (!creatorUser) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }

    const existingTheme = await Theme.findOne({ manualEN: req.body.manualEN });

    if (existingTheme) {
      return res.status(400).json({ success: false, error: 'El tema ya está registrado' });
    }

    const tema = new Theme({
      manualEN: req.body.manualEN,
      descriptionEN: req.body.descriptionEN,
      TitleEN: req.body.TitleEN,
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
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTheme = async (req, res) => {
  try {
    const tema = await Theme.findById(req.params.id);

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
    const temas = await Theme.find();
    return res.status(200).json({ success: true, themes: temas });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateTheme = async (req, res) => {
  try {
    const tema = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!tema) {
      return res.status(404).json({ success: false, message: 'Tema no encontrado' });
    }

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

module.exports = {
  createTheme,
  deleteTheme,
  updateTheme,
  getTheme,
  getThemes
};
