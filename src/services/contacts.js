import createHttpError from 'http-errors';
import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  user,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId: user._id });

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, user) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: user._id,
  });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};

export const postContactById = async (photoUrl, newContact, user) => {
  const contact = await ContactsCollection.create({
    userId: user._id,
    ...newContact,
    photo: photoUrl,
  });
  return contact;
};

export const updateContact = async (
  photoUrl,
  user,
  contactId,
  payload,
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: user._id },
    { ...payload, photo: photoUrl },
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, user) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: user._id,
  });

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  return deletedContact;
};
