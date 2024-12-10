const asyncHandler = require("express-async-handler")
const Contact = require("../models/contactModel")

//@desc get all contacts
//route get /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts)
})

//@desc get contact
//route get /api/contacts
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    // Ensure the contact belongs to the logged-in user
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Permission denied to access this contact");
    }
    res.status(200).json({
        success: true,
        data: contact,
    });
})

//@desc create contacts
//route post /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log("Received POST request with data: ", req.body);
    const { name, email, phone } = req.body;
    // Validate input fields
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("Name, email, and phone fields are mandatory.");
    }
    // Ensure user_id exists in the request (assuming auth middleware)
    if (!req.user.id) {
        res.status(401); // Unauthorized
        throw new Error("User not authenticated.");
    }
    // Create and save the contact
    try {
        const contact = await Contact.create({
            name,
            email,
            phone,
            user_id: req.user.id,
        });
        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: contact,
        });
    } catch (error) {
        console.error("Error creating contact: ", error);
        res.status(500); // Internal Server Error
        throw new Error("Failed to create contact");
    }
});


//@desc update contact
//route put /api/contacts/id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User has no permission to update other user contacts")
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedContact);

})

//@desc delete contacts
//route delete /api/contacts
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User has no permission to update other user contacts")
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: "Contact deleted", data: contact });

})

module.exports = {getContacts, getContact, createContact, updateContact, deleteContact}