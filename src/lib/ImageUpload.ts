import ftp from 'jsftp';

export async function uploadImage(image : Buffer, _id:string){
    const Ftp = new ftp({
        host:process.env.FTP_URI || 'localhost',
        port:parseInt(process.env.PORT) || 21,
        user:process.env.FTP_USER || null,
        pass:process.env.FTP_PASS || null

    })

    await Ftp.put(image,'HDD1/WEBSERVE/'+_id , err => {
        if(!err) return 201;
        return 500;
    })
}