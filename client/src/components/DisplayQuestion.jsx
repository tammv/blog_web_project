import { useEffect, useState } from 'react'

export default function DisplayQuestion() {

    const [checked, setChecked] = useState(undefined);

    useEffect(() => {
        const fetchPost = async () => {
          try {
            const res = await fetch(`/api/quiz`);
            const data = await res.json();
            if (!res.ok) {
              return;
            }
            return data
            
          } catch (error) {
            console.log(error);
          }
        };
        fetchPost();
      });

    function onSelect(){
        setChecked(true);
        console.log("Radio button change");
    }

  return (
    <div>
        <h2>Simple Question</h2>
        <ul>
            <li>
                <input type="radio"
                    value={checked}
                    name='options'
                    id='q1-option'
                    onChange={onSelect}/>
                <label className='text-gray-500' htmlFor="q1-option">option</label>
            </li>
        </ul>
    </div>
  )
}
