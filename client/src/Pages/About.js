import aquib from "../aquib.png";

export default function About() {
    return (
        <div className="p-5 d-flex justify-content-center">
            <div class="row g-5 flex-lg-row-reverse">
                <div className="col-12 col-lg-4 rounded-3 d-flex justify-content-center">
                    <img className="border rounded-circle" src={aquib} alt="Sheikh Aquib Mahmood." width={320}/>
                </div>
                <div className="col-12 col-lg-8 rounded-3">
                    <h1 className="display-5 fw-bold">Created By Sheikh Aquib Mahmood.</h1>
                    <p className="lead">
                        I created this for my personal use and for my portfolio. Originally I was using Trello, but then I thought, "Why don't I build my own?"
                        While not as comprehensive or feature complete as Trello, I believe this will be more than useful for me when working on personal projects. <br/>
                        While the website has a lot of possible features to add, which I may revisit it for in the future, at the moment it is feature complete enough for me
                        to move on to other projects. <br/>
                        If you're a recruiter or a client, you can find me at <a href="mailto:aquibmahmood1637@gmail.com">my email address.</a>
                    </p>
                </div>
            </div>
        </div>
    );
}