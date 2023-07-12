import React, {useEffect, useRef, useState} from 'react';
import './Notes.scss';
import {Layout, Menu, theme, Input, Button} from 'antd';
import {FileTextOutlined, FileAddOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined, SaveOutlined} from '@ant-design/icons'
import {useIndexedDB} from 'react-indexed-db-hook';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const { Content, Sider, Header } = Layout;

interface INote{
    id:number,
    content:string
}

export default function Notes(){
    const db = useIndexedDB('notes');
    const [Data, setData] = useState<INote[]>([]);
    const [ActiveID, setActiveID] = useState<number>(-1);
    const [EditText, setEditText] = useState<string>('');
    const [Editing, setEditing] = useState<boolean>(false);
    const [Creating, setCreating] = useState<boolean>(false);
    const NoteRef = useRef<HTMLDivElement>();
    const MarkDownRef = useRef<HTMLDivElement>();
    useEffect(() => {document.title = "Notes"; getAll()}, []);

    let getAll = async () => {setData(await db.getAll());
        // await db.clear()
    };
    const {token: { colorBgContainer }} = theme.useToken();

    async function openNote(e:any){
        let data = await db.getByID(+e.key);
        setActiveID(+e.key);
        NoteRef.current.innerHTML = data.content;
        setEditText(data.content);
        closeAll();
        getAll();
    }

    async function editNote(){
        NoteRef.current.classList.toggle('deActive');
        MarkDownRef.current.classList.toggle('deActive');
        setEditing(prevState => !prevState);
        NoteRef.current.innerHTML = EditText;
        getAll();
    }

    async function deleteNote(){
        await db.deleteRecord(ActiveID);
        NoteRef.current.innerHTML = '';
        setEditText('');
        setActiveID(-1);
        getAll();
    }

    async function createNote(){
        setEditText('');
        NoteRef.current.classList.toggle('deActive');
        MarkDownRef.current.classList.toggle('deActive');
        setCreating(prevState => !prevState);
        getAll();
    }

    async function saveNote(){
        NoteRef.current.classList.toggle('deActive');
        MarkDownRef.current.classList.toggle('deActive');
        await db.add({content: EditText});
        setCreating(prevState => !prevState);
        getAll();
    }

    function closeAll(){
        if (NoteRef.current.classList.contains('deActive'))
            NoteRef.current.classList.toggle('deActive');
        if(!MarkDownRef.current.classList.contains('deActive'))
            MarkDownRef.current.classList.toggle('deActive');
        setCreating(false)
        setEditing(false)
    }

    let handleChange = async (value:string)=>{
        setEditText(value);
        await db.update({id:ActiveID, content:value});
    };

    let handleSearch = async (e:any) => {
        let data = await db.getAll();
        data = data.filter((el) => el.content.includes(e.target.value));
        setData(data);
    };

    return (
        <Layout style={{height:'100vh'}}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                theme='dark'
                style={{padding: '24px 16px'}}
            >
                <Input className='Search' onChange={handleSearch} placeholder='Search' style={{marginTop:''}}/>
                <Menu
                    className='Menu'
                    theme="dark"
                    mode="inline"
                    items={Data.map(
                        (element, index) => ({
                            key: element?.id,
                            icon: React.createElement(FileTextOutlined),
                            label: element?.content.length < 10 ? element?.content : element?.content.slice(0, 9) + '...'
                        }),
                    )}
                    onClick={openNote}
                />
            </Sider>
            <Layout>
                <Header style={{background:colorBgContainer, display:"flex", alignItems:"center", justifyContent:'space-between'}}>
                    {!Creating ?
                        <Button onClick={createNote} type='primary' icon={<FileAddOutlined rev="true"/>} >Create note</Button>
                        :
                        <Button onClick={saveNote} type='primary' style={{background:"green"}} icon={<SaveOutlined rev="true"/>} >Save</Button>
                    }
                    {ActiveID === -1 ? null :
                        <div>
                            <Button danger onClick={deleteNote} type='primary' shape='circle' icon={<DeleteOutlined rev="true"/>} />
                            {!Editing ?
                                <Button onClick={editNote} type='primary' style={{background:"green", marginLeft: "10px"}} shape='circle' icon={<EditOutlined rev="true"/>} />
                                :
                                <Button onClick={editNote} type='primary' style={{background:"green", marginLeft: "10px"}} shape='circle' icon={<CloseCircleOutlined rev="true"/>} />
                            }
                        </div>
                    }
                </Header>
                <Content style={{margin: '24px 16px', overflowY:"scroll"}}>
                    <div ref={NoteRef} style={{ padding: 24, minHeight:"100%", background: colorBgContainer}}></div>
                    <SimpleMDE className='deActive' ref={MarkDownRef} value={EditText} onChange={!Creating ? handleChange : (value:string)=> setEditText(value) }/>
                </Content>
            </Layout>
        </Layout>
    );
};
