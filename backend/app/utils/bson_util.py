from bson import ObjectId

def fix_id(doc):
    """Converts BSON _id into string id for JSON serialization"""
    if not doc:
        return doc
    if isinstance(doc, list):
        return [fix_id(item) for item in doc]
    if isinstance(doc, dict):
        new_doc = {}
        for k, v in doc.items():
            if k == "_id":
                new_doc["id"] = str(v)
                new_doc["_id"] = str(v)
            elif isinstance(v, ObjectId):
                new_doc[k] = str(v)
            elif isinstance(v, dict):
                new_doc[k] = fix_id(v)
            elif isinstance(v, list):
                new_doc[k] = [fix_id(item) if isinstance(item, dict) else (str(item) if isinstance(item, ObjectId) else item) for item in v]
            else:
                new_doc[k] = v
        return new_doc
    return doc
