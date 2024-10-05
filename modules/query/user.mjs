export const getLatestNewsQuery=`
SELECT n.*,
(SELECT array_to_json(array_agg(f.*)) FROM files f WHERE f.parent_id=n.id AND f.url!='') AS files,
(SELECT f.url FROM files f WHERE f.parent_id=n.id AND f.mime_type='1' LIMIT 1) AS first_image
FROM news n 
WHERE n.is_project=false AND n.is_product=false ORDER BY n.priority DESC, n.created_at DESC
LIMIT 3;
`;

export const getOurProjectsHome=`
SELECT (SELECT array_to_json(array_agg(f.*)) FROM files f WHERE f.parent_id=n.id AND f.url!='') AS files,
(SELECT f.url FROM files f WHERE f.parent_id=n.id AND f.mime_type='1' LIMIT 1) AS first_image,
(SELECT f.url FROM files f WHERE f.parent_id=n.id AND f.mime_type='0' LIMIT 1) AS video_file
FROM news n 
WHERE n.is_project=true AND n.is_product=false ORDER BY n.created_at DESC
LIMIT 5;
`;


export const getCertificateHomeQuery=`
SELECT * FROM certificate ORDER BY created_at DESC;
`;


export const searchQuery=`
SELECT n.*,
(SELECT array_to_json(array_agg(f.*)) FROM files f WHERE f.parent_id=n.id AND f.url!='') AS files,
(SELECT f.url FROM files f WHERE f.parent_id=n.id AND f.mime_type='1' LIMIT 1) AS first_image
FROM news n 
WHERE 
n.title_tm ILIKE '%' || $1 || '%' 
OR n.title_en ILIKE '%' || $1 || '%'
OR n.title_ru ILIKE '%' || $1 || '%'
OR n.content_tm ILIKE '%' || $1 || '%'
OR n.content_ru ILIKE '%' || $1 || '%'
OR n.content_en ILIKE '%' || $1 || '%'
OR n.title_tm ILIKE '%' || $2 || '%' 
OR n.title_en ILIKE '%' || $2 || '%'
OR n.title_ru ILIKE '%' || $2 || '%'
OR n.content_tm ILIKE '%' || $2 || '%'
OR n.content_ru ILIKE '%' || $2 || '%'
OR n.content_en ILIKE '%' || $2 || '%'
OR n.title_tm ILIKE '%' || $3 || '%' 
OR n.title_en ILIKE '%' || $3 || '%'
OR n.title_ru ILIKE '%' || $3 || '%'
OR n.content_tm ILIKE '%' || $3 || '%'
OR n.content_ru ILIKE '%' || $3 || '%'
OR n.content_en ILIKE '%' || $3 || '%'
ORDER BY n.created_at DESC;
`

export const getSingleNewsQuery=`
SELECT n.*,
(SELECT array_to_json(array_agg(f.*)) FROM files f WHERE f.parent_id=n.id AND f.url!='') AS files,
(SELECT f.url FROM files f WHERE f.parent_id=n.id AND f.mime_type='1' LIMIT 1) AS first_image
FROM news n 
WHERE n.id=$1;
`

export const updateViews=`
    UPDATE news SET views=views+1 WHERE id=$1;
`;

export const addInboxQuery=`
INSERT INTO public.inbox(
    fullname, email, message)
    VALUES ($1,$2,$3);
`;