const Contact =require('../models/contact');

const {HttpError} = require('../helpers');

const {ctrlWrapper} =require('../decorators')

const getContactsController = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
}


const getContactDataByIdController= async (req, res) => {
     const {id} =req.params;
     const result =await Contact.findById(id)
     if(!result) { 
     throw HttpError (404, 'Not Found');
     }
     res.json(result);
}


const addNewContactController = async (req, res) => { 
  
      const result = await Contact.create(req.body);
      res.status(201).json(result);
}


const deleteContactByIdController = async (req, res) => {
      const {id} =req.params;
      const result = await Contact.findByIdAndRemove(id);
      if(!result) { 
        throw HttpError (404, 'Not Found');
        }
        res.json({
          message: "contact deleted"
        })
}

const updateContactByIdController= async (req, res) => {
          const {id} = req.params;
          const result =await Contact.findOneAndUpdate(id, req.body, {new: true});
          if(!result){
            throw HttpError(400, 'Not found')
          }
          res.json(result);     
}

const updateStatusContactController = async (req, res) => {
  const {id} = req.params;
  const result =await Contact.findOneAndUpdate(id, req.body, {new: true});
  if(!result){
    throw HttpError(400, 'Not found')
  }
  res.json(result);     
}


module.exports = {
    getContactsController: ctrlWrapper(getContactsController),
    getContactDataByIdController: ctrlWrapper(getContactDataByIdController),
    addNewContactController: ctrlWrapper(addNewContactController),
    deleteContactByIdController: ctrlWrapper(deleteContactByIdController),
    updateContactByIdController: ctrlWrapper(updateContactByIdController),
    updateStatusContactController: ctrlWrapper(updateStatusContactController),
  
}


 
   