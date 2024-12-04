import createHttpError from 'http-errors';
import {
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
  postContactById,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    user: req.user,
  });

  res.status('200').json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user);

  if (!contact) {
    throw createHttpError(
      404,
      'The contact is not found or is not in your contact list',
    );
  }

  res.status('200').json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
export const postContactController = async (req, res) => {
  const contact = await postContactById(req.body, req.user);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(req.user, contactId, req.body);

  if (!result) {
    throw createHttpError(
      404,
      'The contact is not found or is not in your contact list',
    );
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, req.user);

  if (!contact) {
    throw createHttpError(
      404,
      'The contact is not found or is not in your contact list',
    );
  }

  res.status(204).send();
};
