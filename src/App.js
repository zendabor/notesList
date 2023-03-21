import './App.css';
import {useForm} from 'react-hook-form'
import {useEffect, useState} from "react";
function App() {

    const [id,setId]  = useState(5)
    const [messList,setMessList] = useState( [])
    const [edit,setEdit]=useState('')
    const { register, handleSubmit } = useForm();
    const fetchJson = async () => {
        await fetch('./J.json')
            .then(response => {
                return response.json();
            }).then(data => {
                setMessList(data);
            }).catch((e) => {
                console.log(e.message);
            });
    }
    useEffect(() => {
        fetchJson().catch(e=>console.log(e))
    },[])
    const hashtagFind = (description) => {
       return description.match(/#[aA-zZаА-яёЁЯ0-9]{2,}/gm)
    }
    function setNewMess({title,description}) {
        const newHashtag = hashtagFind(description)
        setId(prevState => prevState +1 )
       const item = {
            id:`${title}-${description}`,
            title,
            description,
            hashtag:newHashtag
        }
        setMessList(prevState => [...prevState,item])
    }
    function hashtagfilter(hash,event) {
        event.stopPropagation()
        const arr = messList.filter(item=>
        item.hashtag.includes(hash)
        )
        setMessList(()=>arr)
    }
    function deleteItem(id) {
       const arr =  messList.filter(i=> i.id !== id)
        setMessList(arr)
    }
    function editPost({title,description,id,...obj}) {
        const props = Object.values(obj)
        const hash = hashtagFind(props[1])
        messList.splice(id,1, {id:`${props[0]}-${props[0]}`,title:props[0],description:props[1],hashtag:hash})
        console.log(messList)
        setEdit('')
    }
    return (
        <div className={"container"}>
            {/*<button onClick={()=>setMessList(()=>mess)}>вернуть как было</button>*/}
      <form onSubmit={handleSubmit(setNewMess)}>
          <div className="mess_wrap">
              <input className={'title_mess'} type={'text'}{...register('title')}/>
              <input className={'text_mess'} type={'text'} {...register('description')}/>
              <button type={"submit"}>создать заметку</button>
          </div>
      </form>
            {messList.length !== 0 ? <ul>
                {messList?.map((i,index)=>{
                    return (
                        <li style={{display:"flex",flexDirection:"column",gap:15,marginBottom:15,border:'3px solid blue',padding:20}} key={i.id} onClick={()=>setEdit(i.id)}>
                            {edit === i.id ?
                                <form onSubmit={handleSubmit(editPost)}>
                                    <input hidden {...register('id')}
                                           value={index}
                                    />
                                    <input {...register(`editTitle${id}`)}
                                           defaultValue={i.title}/>
                                    <input {...register(`editDescription${id}`)}
                                           defaultValue={i.description}
                                    />
                                    <button type={"submit"}>сохранить изменения</button>
                                </form>
                                :<>
                                    <div>{i.title}</div>
                                    <div>{i.description}</div>
                                    <div style={{display:"flex",flexDirection:"column",gap:15}}>
                                        <button onClick={()=>deleteItem(i.id)}>удалить записку</button>
                                        {i.hashtag?.map((i,index)=> {
                                            return (<button
                                                key={`${index}${i}`}
                                                onClick={event=>hashtagfilter(i,event)}>{i}
                                            </button>)
                                        })}
                                    </div>
                                </>
                            }
                        </li>
                    )
                })}
            </ul>:<span>у вас больше нет заметок</span>}
    </div>
  );
}
export default App;
