import React from 'react';
import "./EditInfoIcon.css";


export default function EditInfoIcon({ text}) {
    const [show, setShow] = React.useState(false);
    return (
        // <div>
        //     <Tooltip title={description}>
        //         <IconButton>
        //             <i className="bi bi-info-circle"></i>
        //         </IconButton>
        //     </Tooltip>
        // </div>
        <div>
      <div>
        <h1 
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >Hola</h1>

      </div>
      {/* {show ? "JDkjsfldjsdf" :""} */}
      {show?<div className='filesList'>
        Officia qui id ut irure veniam sunt anim. Commodo amet proident esse culpa irure mollit culpa occaecat sunt exercitation. Cupidatat consectetur id sint anim nostrud ut eiusmod sint. Commodo consequat tempor laborum consequat. Et aliqua laboris quis ex et laborum ipsum aute reprehenderit aute ea. Incididunt Lorem ad exercitation id incididunt fugiat dolore ea est elit deserunt. Laboris officia aliqua commodo adipisicing est nisi incididunt sint ex.
      </div>:""}
    </div>
    )
}
