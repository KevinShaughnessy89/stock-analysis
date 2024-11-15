import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import RSSFeedController from "./RSSFeedController.js";

const RSSDisplay = ({article, setIndex, feedConfig, setFeedConfig}) => {

    return (
        <div>
            <Card className="h-128 w-96">
                <CardHeader className='space-y-2'>
                    <CardTitle className='w-full h-32 overflow-y-auto'><a href={article?.link}>{article?.title}</a></CardTitle>
                    <CardDescription className='h-20 p-0 m-0 overflow-y-auto'>
                        <p className='shadow-md p-0 m-0 rounded-lg h-full'>{article?.description} - {article?.author}</p>
                    </CardDescription>
                </CardHeader>
                <RSSFeedController article={article} setIndex={setIndex} feedConfig={feedConfig} setFeedConfig={setFeedConfig} />
                </Card>
        </div>
    );
}

export default RSSDisplay;