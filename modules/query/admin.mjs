export const loginQuery=`
    SELECT * FROM public.users WHERE username=$1 AND "password"=$2;
`;

export const getNewsQuery=`
SELECT n.*,
(SELECT array_to_json(array_agg(f.*)) FROM files f WHERE f.parent_id=n.id AND f.url!='') AS files,
(SELECT f.url FROM files f WHERE f.parent_id=n.id AND f.mime_type='1' LIMIT 1) AS first_image
FROM news n 
WHERE n.is_project=$1 ORDER BY n.created_at DESC
LIMIT $2 OFFSET ($3 - 1) * $2;
`;

export const getNewsQueryCount=`
SELECT n.*,
(SELECT array_to_json(array_agg(f.*)) FROM files f WHERE f.parent_id=n.id AND f.url!='') AS files,
(SELECT f.url FROM files f WHERE f.parent_id=n.id AND f.mime_type='1' LIMIT 1) AS first_image
FROM news n 
WHERE n.is_project=$1 ORDER BY n.created_at DESC
`;

export const addNewsQuery=`
INSERT INTO news(
    title_tm, title_ru, title_en, content_tm, content_ru, content_en, views, is_project)
    VALUES ($1,$2,$3,$4, $5, $6, 0,$7) RETURNING *;
`;

export const addFilesQuery=`
INSERT INTO files(
    url, parent_id, mime_type)
    VALUES %L RETURNING *;
`;

export const getFilesById=`SELECT * FROM public.files WHERE parent_id=$1;`

export const deleteNews=`
    DELETE FROM news WHERE id=$1;
`;

export const deleteFiles=`
DELETE FROM public.files
WHERE id IN (%L) AND mime_type=%s::TEXT;
`

export const updateNewsQuery=`
UPDATE public.news
    SET title_tm=$1, title_ru=$2, title_en=$3, content_tm=$4, content_ru=$5, content_en=$6, updated_at='now()'
    WHERE id=$7 RETURNING *;
`;

export const addCertificateQuery=`
    INSERT INTO certificate(name,file_path, image, status) VALUES ($1, $2, $3, true) RETURNING *;
`;

export const getCertificateQuery=`
SELECT * FROM certificate ORDER BY created_at DESC;
`;

export const deleteCertificateQuery=`DELETE FROM certificate WHERE id=$1;`;
export const getSingleCertificateQuery=`SELECT * FROM certificate WHERE id=$1;`;

export const updateInbox=`
    UPDATE public.inbox SET is_read=true;
`;