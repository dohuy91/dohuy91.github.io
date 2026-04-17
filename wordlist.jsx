const { useState, useEffect, useMemo, useRef } = React

// Quick icon placeholders for static HTML mode (no module imports).
const makeIcon =
  (symbol) =>
  ({ size = 20, className = '' }) => (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.max(12, Math.floor(size * 0.75)),
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {symbol}
    </span>
  )

const Volume2 = makeIcon('S')
const ChevronLeft = makeIcon('<')
const ChevronRight = makeIcon('>')
const CheckCircle2 = makeIcon('V')
const Brain = makeIcon('B')
const BookOpen = makeIcon('BK')
const LayoutGrid = makeIcon('[]')
const Star = makeIcon('*')
const Layers = makeIcon('=')
const Search = makeIcon('?')
const Check = makeIcon('ok')
const Trophy = makeIcon('T')

// Nén dữ liệu từ vựng bằng chuỗi để chứa được >800 từ mà không làm nặng file
const RAW_VOCAB = {
  Starters: {
    Animals:
      'animal|động vật|🐾,bear|con gấu|🐻,bee|con ong|🐝,bird|con chim|🐦,cat|con mèo|🐱,chicken|con gà|🐔,cow|con bò|🐄,crocodile|cá sấu|🐊,dog|con chó|🐶,donkey|con lừa|🫏,duck|con vịt|🦆,elephant|con voi|🐘,fish|con cá|🐟,frog|con ếch|🐸,giraffe|hươu cao cổ|🦒,goat|con dê|🐐,hippo|hà mã|🦛,horse|con ngựa|🐎,jellyfish|con sứa|🪼,lizard|thằn lằn|🦎,monkey|con khỉ|🐒,mouse|con chuột|🐭,pet|thú cưng|🏠,polar bear|gấu Bắc Cực|🐻‍❄️,sheep|con cừu|🐑,snake|con rắn|🐍,spider|con nhện|🕷️,tail|cái đuôi|🐕,tiger|con hổ|🐅,zebra|ngựa vằn|🦓,zoo|sở thú|🦁',
    Body: 'arm|cánh tay|💪,body|cơ thể|👤,ear|tai|👂,eye|mắt|👁️,face|khuôn mặt|😊,foot|bàn chân|👣,hair|tóc|💇,hand|bàn tay|✋,head|đầu|👤,leg|cái chân|🦵,mouth|cái miệng|👄,nose|cái mũi|👃,smile|nụ cười|😃',
    Clothes:
      'bag|cái túi|👜,baseball cap|mũ lưỡi trai|🧢,boots|ủng/giày ống|🥾,clothes|quần áo|👕,dress|váy liền|👗,glasses|kính mắt|👓,handbag|túi xách|👜,hat|cái mũ|🎩,jacket|áo khoác|🧥,jeans|quần bò|👖,shirt|áo sơ mi|👕,shoe|chiếc giày|👟,shorts|quần đùi|🩳,skirt|chân váy|👗,sock|chiếc tất|🧦,trousers|quần dài|👖,T-shirt|áo thun|👕,wear|mặc/đeo|👕',
    Colours:
      'black|màu đen|⬛,blue|màu xanh dương|🟦,brown|màu nâu|🟫,colour|màu sắc|🎨,gray|màu xám|⬜,green|màu xanh lá|🟩,grey|màu xám (UK)|⬜,orange|màu cam|🟧,pink|màu hồng|🌸,purple|màu tím|🟪,red|màu đỏ|🟥,white|màu trắng|⬜,yellow|màu vàng|🟨',
    Family:
      'baby|em bé|👶,boy|con trai|👦,brother|anh/em trai|👦,child|đứa trẻ|🧒,classmate|bạn cùng lớp|🧑‍🤝‍🧑,cousin|anh em họ|🧒,dad|bố|👨,family|gia đình|👨‍👩‍👧‍👦,father|cha|👨,friend|bạn bè|🤝,girl|con gái|👧,grandfather|ông|👴,grandma|bà|👵,grandmother|bà|👵,grandpa|ông|👴,kid|đứa trẻ|🧒,live|sống|🏠,man|đàn ông|👨,mother|mẹ|👩,mum|mẹ|👩,old|già/cũ|👴,person|người|👤,sister|chị/em gái|👧,woman|phụ nữ|👩,young|trẻ|👶',
    Food: 'apple|quả táo|🍎,banana|quả chuối|🍌,bean|hạt đậu|🫘,bread|bánh mì|🍞,breakfast|bữa sáng|🍳,burger|bánh mì kẹp|🍔,cake|bánh ngọt|🍰,candy|kẹo|🍬,carrot|củ cà rốt|🥕,chicken|thịt gà|🍗,chips|khoai tây chiên|🍟,chocolate|sô-cô-la|🍫,coconut|quả dừa|🥥,dinner|bữa tối|🍽️,drink|đồ uống|🥤,eat|ăn|🍴,egg|quả trứng|🥚,fish|thịt cá|🐟,food|thức ăn|🍲,fruit|trái cây|🍎,grape|quả nho|🍇,ice cream|kem|🍦,juice|nước ép|🧃,kiwi|quả kiwi|🥝,lemon|quả chanh vàng|🍋,lemonade|nước chanh|🥤,lime|quả chanh xanh|🍋,lunch|bữa trưa|🍱,mango|quả xoài|🥭,meat|thịt|🥩,milk|sữa|🥛,onion|củ hành tây|🧅,orange|quả cam|🍊,pea|đậu hà lan|🫛,pear|quả lê|🍐,pie|bánh nướng|🥧,pineapple|quả dứa|🍍,potato|củ khoai tây|🥔,rice|cơm|🍚,sausage|xúc xúc|🌭,sweet|kẹo/ngọt|🍬,tomato|quả cà chua|🍅,water|nước|💧,watermelon|dưa hấu|🍉',
    Health:
      'cold|cảm lạnh|🤒,cough|ho|😷,cry|khóc|😢,dentist|nha sĩ|🦷,doctor|bác sĩ|👨‍⚕️,earache|đau tai|👂,fall|ngã|🤕,fine|ổn/khỏe|😊,headache|đau đầu|🤕,hospital|bệnh viện|🏥,ill|ốm|🤒,matter|vấn đề|❓,nurse|y tá|👩‍⚕️,sick|ốm|🤢,stomach-ache|đau bụng|🤢,temperature|nhiệt độ/sốt|🤒,tired|mệt mỏi|🥱,toothache|đau răng|🦷',
    Home: 'apartment|căn hộ|🏢,armchair|ghế bành|🪑,bath|bồn tắm|🛁,bathroom|phòng tắm|🚿,bed|giường|🛏️,bedroom|phòng ngủ|🛏️,bookcase|tủ sách|📚,box|cái hộp|📦,camera|máy ảnh|📷,chair|cái ghế|🪑,clock|đồng hồ|⏰,computer|máy tính|💻,cupboard|tủ chén|🍽️,desk|bàn học|📝,dining room|phòng ăn|🍴,doll|búp bê|🪆,door|cửa|🚪,flat|căn hộ|🏢,flower|bông hoa|🌸,garden|vườn|🏡,hall|hành lang|🚪,home|nhà|🏠,house|ngôi nhà|🏠,kitchen|nhà bếp|🍳,lamp|đèn|💡,living room|phòng khách|🛋️,mat|tấm thảm|🧶,mirror|cái gương|🪞,phone|điện thoại|📞,picture|bức tranh|🖼️,radio|đài radio|📻,room|căn phòng|🏠,rug|thảm trải sàn|🧶,sleep|ngủ|💤,sofa|ghế sofa|🛋️,table|cái bàn|🏷️,television|tivi|📺,toy|đồ chơi|🧸,tree|cái cây|🌳,wall|bức tường|🧱,watch|đồng hồ đeo tay|⌚,window|cửa sổ|🪟',
    Numbers:
      'one|số một|1️⃣,two|số hai|2️⃣,three|số ba|3️⃣,four|số bốn|4️⃣,five|số năm|5️⃣,six|số sáu|6️⃣,seven|số bảy|7️⃣,eight|số tám|8️⃣,nine|số chín|9️⃣,ten|số mười|🔟,eleven|số mười một|1️⃣1️⃣,twelve|số mười hai|1️⃣2️⃣,thirteen|số mười ba|1️⃣3️⃣,fourteen|mười bốn|1️⃣4️⃣,fifteen|mười lăm|1️⃣5️⃣,sixteen|mười sáu|1️⃣6️⃣,seventeen|mười bảy|1️⃣7️⃣,eighteen|mười tám|1️⃣8️⃣,nineteen|mười chín|1️⃣9️⃣,twenty|hai mươi|2️⃣0️⃣',
    Places:
      'behind|đằng sau|🔙,between|ở giữa|↔️,bookshop|tiệm sách|📚,end|kết thúc|🔚,here|ở đây|📍,in|bên trong|📥,in front of|phía trước|⏩,on|trên|🔛,park|công viên|🌳,playground|sân chơi|🛝,shop|cửa hàng|🛒,store|cửa hàng|🏪,street|đường phố|🛣️,there|ở đó|📍,under|bên dưới|🔽,zoo|sở thú|🦁',
    School:
      'alphabet|bảng chữ cái|🔤,answer|trả lời|🙋,ask|hỏi|❓,board|cái bảng|🏫,book|quyển sách|📖,class|lớp học|👨‍🏫,classroom|phòng học|🏫,close|đóng|🚪,colour|tô màu|🖍️,computer|máy tính|💻,correct|chính xác|✅,crayon|bút sáp màu|🖍️,cross|dấu chéo|❌,cupboard|tủ|🚪,desk|bàn học|🪑,door|cửa ra vào|🚪,draw|vẽ|✏️,English|môn Tiếng Anh|🇬🇧,eraser|cục tẩy|🧽,example|ví dụ|📝,find|tìm kiếm|🔍,floor|sàn nhà|🟫,keyboard|bàn phím|⌨️,learn|học|🧠,lesson|bài học|📚,letter|chữ cái|🅰️,line|đường kẻ|➖,listen|nghe|👂,look|nhìn|👀,mouse|chuột máy tính|🖱️,music|âm nhạc|🎵,number|con số|🔢,open|mở|📖,page|trang sách|📄,painting|bức tranh|🎨,paper|tờ giấy|📄,part|phần|🍕,pen|cái bút|🖊️,pencil|bút chì|✏️,picture|bức tranh|🖼️,playground|sân chơi|🛝,poster|áp phích|🖼️,question|câu hỏi|❓,read|đọc|📖,right|đúng|✅,rubber|cục tẩy|🧽,ruler|thước kẻ|📏,school|trường học|🏫,sentence|câu|📝,sit|ngồi|🪑,spell|đánh vần|🔤,stand|đứng|🧍,story|câu chuyện|📚,teacher|giáo viên|👨‍🏫,tell|kể/bảo|🗣️,tick|dấu tích|✅,understand|hiểu|💡,wall|bức tường|🧱,window|cửa sổ|🪟,word|từ|🔤,write|viết|✍️',
    Sports:
      'badminton|cầu lông|🏸,ball|quả bóng|⚽,baseball|bóng chày|⚾,basketball|bóng rổ|🏀,bat|gậy đánh bóng|🏏,beach|bãi biển|🏖️,bike|xe đạp|🚲,boat|con thuyền|⛵,book|quyển sách|📖,bounce|nảy|🏀,camera|máy ảnh|📷,catch|bắt lấy|🧤,doll|búp bê|🎎,draw|vẽ|✏️,drawing|bức vẽ|🖼️,drive|lái xe|🚗,enjoy|thưởng thức|😊,favourite|yêu thích|❤️,fishing|câu cá|🎣,fly|bay/thả diều|🪁,football|bóng đá|⚽,game|trò chơi|🎮,guitar|đàn guitar|🎸,hobby|sở thích|🎨,hockey|khúc côn cầu|🏑,jump|nhảy|🏃,kick|đá|🦵,kite|con diều|🪁,listen|nghe|🎧,music|âm nhạc|🎵,photo|bức ảnh|📷,piano|đàn piano|🎹,picture|bức tranh|🖼️,play|chơi|🎮,radio|đài|📻,read|đọc|📖,ride|cưỡi/đạp xe|🚲,run|chạy|🏃,sing|hát|🎤,skateboard|trượt ván|🛹,skateboarding|môn trượt ván|🛹,soccer|bóng đá|⚽,song|bài hát|🎵,sport|thể thao|🏅,story|câu chuyện|📚,swim|bơi|🏊,table tennis|bóng bàn|🏓,take a photo|chụp ảnh|📸,television|tivi|📺,tennis|quần vợt|🎾,tennis racket|vợt tennis|🎾,throw|ném|🤾,toy|đồ chơi|🧸,walk|đi bộ|🚶,watch|xem|👁️',
    Time: 'afternoon|buổi chiều|🌇,birthday|sinh nhật|🎂,clock|đồng hồ|🕰️,day|ngày|☀️,evening|buổi tối|🌆,morning|buổi sáng|🌅,night|đêm|🌙,today|hôm nay|📅,watch|đồng hồ đeo tay|⌚,year|năm|🗓️',
    Toys: 'alien|người ngoài hành tinh|👽,ball|quả bóng|⚽,balloon|bóng bay|🎈,baseball|bóng chày|⚾,basketball|bóng rổ|🏀,bike|xe đạp|🚲,board game|trò chơi cờ bàn|🎲,boat|con thuyền|⛵,car|ô tô đồ chơi|🚗,doll|búp bê|🎎,football|bóng đá|⚽,game|trò chơi|🎮,helicopter|trực thăng|🚁,lorry|xe tải|🚛,monster|quái vật|👹,motorbike|xe máy|🏍️,plane|máy bay|✈️,robot|người máy|🤖,soccer|bóng đá|⚽,teddy|gấu bông|🧸,toy|đồ chơi|🧸,train|tàu hỏa|🚂,truck|xe tải|🚚',
    Transport:
      'bike|xe đạp|🚲,boat|con thuyền|⛵,bus|xe buýt|🚌,car|ô tô|🚗,drive|lái xe|🚗,fly|bay|✈️,go|đi|🚶,helicopter|trực thăng|🚁,lorry|xe tải|🚛,plane|máy bay|✈️,ride|cưỡi|🚲,run|chạy|🏃,ship|tàu thủy|🚢,swim|bơi|🏊,train|tàu hỏa|🚂,truck|xe tải|🚚',
    Weather:
      'sun|mặt trời|☀️,cloud|đám mây|☁️,cloudy|nhiều mây|⛅,ice|đá|🧊,rain|mưa|🌧️,rainbow|cầu vồng|🌈,sky|bầu trời|🌤️,snow|tuyết|❄️,sunny|nắng|☀️,weather|thời tiết|🌡️,wind|gió|💨,windy|có gió|🌬️',
    Work: 'teacher|giáo viên|👨‍🏫,circus|rạp xiếc|🎪,clown|chú hề|🤡,cook|đầu bếp|👨‍🍳,dentist|nha sĩ|🦷,doctor|bác sĩ|👨‍⚕️,driver|tài xế|🚗,farmer|nông dân|👨‍🌾,film star|ngôi sao điện ảnh|⭐,hospital|bệnh viện|🏥,nurse|y tá|👩‍⚕️,pirate|cướp biển|🏴‍☠️,pop star|ngôi sao nhạc pop|🎤,work|làm việc|💼',
    World:
      'beach|bãi biển|🏖️,sand|cát|🏜️,sea|biển|🌊,shell|vỏ sò|🐚,street|con phố|🛣️,sun|mặt trời|☀️,tree|cái cây|🌳,water|nước|💧',
  },
  Movers: {
    Animals:
      'bat|con dơi|🦇,cage|cái lồng|🕸️,dolphin|cá heo|🐬,fly|con ruồi|🪰,kangaroo|chuột túi|🦘,kitten|mèo con|🐱,lion|sư tử|🦁,panda|gấu trúc|🐼,parrot|con vẹt|🦜,penguin|chim cánh cụt|🐧,puppy|chó con|🐶,rabbit|con thỏ|🐇,shark|cá mập|🦈,snail|ốc sên|🐌,whale|cá voi|🐋',
    Body: 'back|cái lưng|👤,beard|râu quai nón|🧔,blond|tóc vàng|👱,curly|tóc xoăn|👩‍🦱,fair|da trắng/sáng|👩🏻,fat|béo/mập|🤰,moustache|ria mép|👨,neck|cái cổ|👤,shoulder|vai|👤,stomach|bụng|🤰,thin|gầy/mỏng|🧍,tooth|răng|🦷',
    Clothes:
      'coat|áo khoác dáng dài|🧥,helmet|mũ bảo hiểm|⛑️,scarf|khăn quàng|🧣,sweater|áo len|🧥,swimsuit|đồ bơi|🩱',
    Food: 'bottle|cái chai|🍼,bowl|cái bát/tô|🥣,cheese|phô mai|🧀,coffee|cà phê|☕,cup|cái tách|☕,glass|cái ly|🥛,hungry|đói bụng|🤤,milkshake|sữa lắc|🥤,noodles|mì|🍜,pancake|bánh kếp|🥞,pasta|mì ý|🍝,picnic|dã ngoại|🧺,plate|cái đĩa|🍽️,salad|sa lát|🥗,sandwich|bánh mì kẹp|🥪,sauce|nước xốt|🥫,soup|súp|🍲,tea|trà|🍵,thirsty|khát nước|🥵,vegetable|rau củ|🥦',
    Health:
      'bandage|băng gạc|🩹,chemist|hiệu thuốc|👨‍🔬,cut|vết cắt|✂️,fall over|ngã|🤕,medicine|thuốc|💊,x-ray|chụp x-quang|🩻',
    Home: 'address|địa chỉ|🏠,balcony|ban công|🌅,basement|tầng hầm|🧱,blanket|cái chăn|🛌,downstairs|tầng dưới|👇,dream|giấc mơ|💭,elevator|thang máy|🛗,floor|sàn nhà|🏠,internet|mạng internet|🌐,lift|thang máy|🛗,message|tin nhắn|💬,roof|mái nhà|🏠,seat|chỗ ngồi|💺,shower|vòi sen|🚿,stairs|cầu thang|🪜,toothbrush|bàn chải đánh răng|🪥,toothpaste|kem đánh răng|🧴,towel|khăn tắm|🧼,upstairs|tầng trên|👆,wash|rửa/giặt|🧼',
    Numbers:
      'twenty-one|hai mươi mốt|2️⃣1️⃣,twenty-eight|hai mươi tám|2️⃣8️⃣,thirty-four|ba mươi tư|3️⃣4️⃣,forty|bốn mươi|4️⃣0️⃣,forty-two|bốn mươi hai|4️⃣2️⃣,fifty|năm mươi|5️⃣0️⃣,sixty-seven|sáu mươi bảy|6️⃣7️⃣,seventy-three|bảy mươi ba|7️⃣3️⃣,eighty-five|tám mươi lăm|8️⃣5️⃣,ninety|chín mươi|9️⃣0️⃣,hundred|một trăm|💯,pair|một cặp|👟',
    Places:
      'above|ở trên|⬆️,below|ở dưới|⬇️,building|tòa nhà|🏢,bus station|bến xe buýt|🚏,bus stop|trạm xe buýt|🚏,café|quán cà phê|☕,car park|bãi đỗ xe|🅿️,centre|trung tâm|🎯,cinema|rạp phim|🎬,circle|hình tròn|⭕,circus|rạp xiếc|🎪,city centre|trung tâm thành phố|🏙️,farm|nông trại|🚜,funfair|hội chợ|🎡,hospital|bệnh viện|🏥,library|thư viện|📚,map|bản đồ|🗺️,market|chợ|🛒,near|gần|📍,opposite|đối diện|↔️,place|địa điểm|📍,shopping centre|trung tâm mua sắm|🏬,sports centre|trung tâm thể thao|🏟️,square|quảng trường|⏹️,station|nhà ga|🚉,straight|đi thẳng|⬆️,supermarket|siêu thị|🏬,swimming pool|hồ bơi|🏊',
    School:
      'break|giờ giải lao|⏰,homework|bài tập về nhà|📝,mistake|lỗi sai|❌,teach|dạy học|👨‍🏫,text|văn bản|📄,website|trang web|🌐',
    Sports:
      'band|ban nhạc|🎸,CD|đĩa CD|💿,cinema|rạp phim|🎬,comic|truyện tranh|🦸,dance|nhảy múa|💃,DVD|đĩa DVD|📀,email|thư điện tử|📧,film|phim ảnh|🎞️,fish|câu cá|🎣,go shopping|đi mua sắm|🛍️,goal|bàn thắng|🥅,holiday|kỳ nghỉ|🏖️,hop|nhảy lò cò|🦘,ice skating|trượt băng|⛸️,movie|bộ phim|🍿,net|cái lưới|🥅,party|bữa tiệc|🎉,player|người chơi|🏃,pool|hồ bơi|🏊,practice|thực hành|🎯,present|món quà|🎁,roller skating|trượt patin|🛼,sail|chèo thuyền|⛵,score|điểm số|💯,skate|trượt|⛸️,skip|nhảy dây|🪢,sports centre|trung tâm thể thao|🏟️,swim|bơi|🏊,text|nhắn tin|📱,video|đoạn phim|📹',
    Time: "after|sau khi|🔜,always|luôn luôn|🔄,before|trước khi|🔙,every|mỗi|📅,never|không bao giờ|❌,o'clock|giờ|🕛,sometimes|thỉnh thoảng|⏳,week|tuần|📅,weekend|cuối tuần|🎉,yesterday|hôm qua|🔙,Monday|thứ Hai|1️⃣,Tuesday|thứ Ba|2️⃣,Wednesday|thứ Tư|3️⃣,Thursday|thứ Năm|4️⃣,Friday|thứ Sáu|5️⃣,Saturday|thứ Bảy|6️⃣,Sunday|Chủ Nhật|7️⃣",
    Transport:
      'bus station|bến xe buýt|🚏,bus stop|trạm xe buýt|🚏,drive|lái xe|🚗,driver|tài xế|👨‍✈️,ride|đi xe/cưỡi|🚲,station|nhà ga|🚉,ticket|vé|🎟️,tractor|máy kéo|🚜,trip|chuyến đi|🧳',
    Weather: 'fog|sương mù|🌫️,foggy|có sương mù|🌫️,storm|cơn bão|⛈️',
  },
  Flyers: {
    Animals:
      'beetle|bọ cánh cứng|🐞,butterfly|con bướm|🦋,camel|lạc đà|🐫,creature|sinh vật|👾,dinosaur|khủng long|🦖,eagle|đại bàng|🦅,extinct|tuyệt chủng|🦴,fur|lông thú|🐻,insect|côn trùng|🪲,nest|cái tổ|🪹,octopus|bạch tuộc|🐙,swan|thiên nga|🦢,tortoise|rùa cạn|🐢,wild|hoang dã|🌳,wing|cánh|🪽',
    Body: 'elbow|khuỷu tay|💪,finger|ngón tay|👆,knee|đầu gối|🦵,toe|ngón chân|🦶',
    Clothes:
      'belt|thắt lưng|🥋,bracelet|vòng đeo tay|📿,costume|trang phục hóa trang|🦸,crown|vương miện|👑,glove|găng tay|🧤,necklace|vòng cổ|📿,pajamas|bộ đồ ngủ|🛌,pocket|túi áo quần|👖,ring|nhẫn|💍,spot|dấu chấm|⏺️,spotted|có đốm|🐆,stripe|sọc|🦓,striped|có sọc|🦓,sunglasses|kính râm|🕶️,trainers|giày thể thao|👟,umbrella|cái ô|☂️,uniform|đồng phục|🧑‍✈️',
    Food: 'biscuit|bánh quy|🍪,butter|bơ|🧈,cereal|ngũ cốc|🥣,chopsticks|đũa|🥢,cookie|bánh quy|🍪,flour|bột mì|🌾,fork|nĩa|🍴,honey|mật ong|🍯,jam|mứt|🍓,knife|dao|🔪,meal|bữa ăn|🍽️,olives|quả ô liu|🫒,pepper|hạt tiêu|🧂,piece|mảnh/miếng|🍰,pizza|bánh pizza|🍕,salt|muối|🧂,smell|ngửi/mùi|👃,snack|đồ ăn vặt|🥨,spoon|cái thìa|🥄,strawberry|dâu tây|🍓,sugar|đường|🍬,taste|nếm/vị|👅,yoghurt|sữa chua|🥛',
    Home: 'brush|cái bàn chải|🖌️,comb|cái lược|梳,cooker|bếp lò|🍳,cushion|gối tựa|🛋️,diary|nhật ký|📓,entrance|lối vào|🚪,envelope|phong bì|✉️,fridge|tủ lạnh|🧊,gate|cổng|⛩️,key|chìa khóa|🔑,letter|bức thư|✉️,oven|lò nướng|🥧,screen|màn hình|🖥️,shampoo|dầu gội|🧴,shelf|cái kệ|📚,soap|xà phòng|🧼,stamp|con tem|🪪,step|bậc thang|🪜,swing|xích đu|🛝,telephone|điện thoại bàn|☎️',
    Numbers:
      'one hundred and one|một trăm lẻ một|💯,one hundred and fifteen|một trăm mười lăm|💯,one hundred and twenty-three|một trăm hai mươi ba|💯,two hundred|hai trăm|2️⃣0️⃣0️⃣,two hundred and forty-six|hai trăm bốn mươi sáu|🔢,three hundred|ba trăm|3️⃣0️⃣0️⃣,four hundred|bốn trăm|4️⃣0️⃣0️⃣,five hundred|năm trăm|5️⃣0️⃣0️⃣,seven hundred|bảy trăm|7️⃣0️⃣0️⃣,nine hundred and ninety-nine|chín trăm chín mươi chín|🔢,hundred|trăm|💯,million|triệu|💰,several|một vài|🔢,thousand|nghìn|🔟',
    Places:
      'airport|sân bay|✈️,bank|ngân hàng|🏦,bridge|cây cầu|🌉,castle|lâu đài|🏰,chemist|hiệu thuốc|💊,club|câu lạc bộ|♣️,college|trường cao đẳng|🏫,corner|góc đường|🔀,east|hướng đông|🧭,factory|nhà máy|🏭,fire station|trạm cứu hỏa|🚒,front|phía trước|⏩,get to|đi đến|🚶,hotel|khách sạn|🏨,kilometre|ki-lô-mét|📏,left|bên trái|⬅️,London|Luân Đôn|🇬🇧,middle|ở giữa|⏺️,museum|bảo tàng|🏛️,north|hướng bắc|⬆️,over|vượt qua|↗️,path|con đường|🛣️,police station|đồn cảnh sát|🚓,post office|bưu điện|📮,restaurant|nhà hàng|🍽️,right|bên phải|➡️,skyscraper|tòa nhà chọc trời|🏙️,south|hướng nam|⬇️,stadium|sân vận động|🏟️,straight on|đi thẳng|⬆️,theatre|nhà hát|🎭,university|đại học|🎓,way|đường đi|🛣️,west|hướng tây|⬅️',
    School:
      'art|môn mỹ thuật|🎨,backpack|ba lô|🎒,bin|thùng rác|🗑️,club|câu lạc bộ|👥,college|trường cao đẳng|🏫,competition|cuộc thi|🏆,dictionary|từ điển|📖,flag|lá cờ|🚩,geography|môn địa lý|🌍,glue|hồ dán|🧴,group|nhóm|👥,gym|phòng thể dục|🏋️,history|môn lịch sử|📜,language|ngôn ngữ|🗣️,maths|môn toán|🧮,online|trực tuyến|🌐,project|dự án|📊,science|môn khoa học|🔬,scissors|cái kéo|✂️,screen|màn hình|🖥️,shelf|cái kệ|📚,student|học sinh|🧑‍🎓,study|học tập|📖,subject|môn học|📚,timetable|thời khóa biểu|📅,university|đại học|🎓',
    Sports:
      'backpack|ba lô|🎒,cartoon|phim hoạt hình|📺,channel|kênh truyền hình|📺,chess|cờ vua|♟️,collect|sưu tầm|🗂️,concert|buổi hòa nhạc|🎫,diary|nhật ký|📓,drum|cái trống|🥁,festival|lễ hội|🎊,flashlight|đèn pin|🔦,golf|môn gôn|⛳,hotel|khách sạn|🏨,instrument|nhạc cụ|🎺,invitation|lời mời|✉️,join|tham gia|🤝,magazine|tạp chí|📰,match|trận đấu|⚽,meet|gặp gỡ|🤝,member|thành viên|👤,online|trực tuyến|💻,pop music|nhạc pop|🎵,prize|giải thưởng|🏆,programme|chương trình|📺,puzzle|câu đố|🧩,pyramid|kim tự tháp|🏜️,quiz|câu đố|❓,race|cuộc đua|🏁,rock music|nhạc rock|🎸,rucksack|ba lô|🎒,ski|trượt tuyết|⛷️,sledge|xe trượt tuyết|🛷,snowball|bóng tuyết|⛄,snowboard|ván trượt tuyết|🏂,snowman|người tuyết|⛄,stage|sân khấu|🎭,suitcase|va li|🧳,swing|xích đu|🛝,team|đội|👥,tent|cái lều|⛺,torch|đèn pin|🔦,tune|giai điệu|🎵,tyre|lốp xe|🛞,umbrella|cái ô|☂️,violin|đàn vĩ cầm|🎻,volleyball|bóng chuyền|🏐,winner|người chiến thắng|🏆',
    Time: 'a.m.|buổi sáng|🌅,after|sau|🔜,ago|trước đây|🔙,autumn|mùa thu|🍂,before|trước|🔙,calendar|lịch|📅,century|thế kỷ|💯,date|ngày tháng|📅,early|sớm|🌅,end|kết thúc|🔚,fall|mùa thu|🍂,future|tương lai|🚀,hour|giờ|⏳,how long|bao lâu|⏱️,late|muộn|🌃,later|sau đó|🔜,midday|giữa trưa|☀️,midnight|nửa đêm|🕛,minute|phút|⏱️,month|tháng|🗓️,p.m.|buổi chiều tối|🌆,past|đã qua|🔙,quarter|một phần tư|🕒,spring|mùa xuân|🌸,summer|mùa hè|☀️,time|thời gian|⌚,tomorrow|ngày mai|🔜,tonight|tối nay|🌙,winter|mùa đông|❄️,January|tháng Một|1️⃣,February|tháng Hai|2️⃣,March|tháng Ba|3️⃣,April|tháng Tư|4️⃣,May|tháng Năm|5️⃣,June|tháng Sáu|6️⃣,July|tháng Bảy|7️⃣,August|tháng Tám|8️⃣,September|tháng Chín|9️⃣,October|tháng Mười|🔟,November|tháng Mười Một|1️⃣1️⃣,December|tháng Mười Hai|1️⃣2️⃣',
    Transport:
      'ambulance|xe cứu thương|🚑,bicycle|xe đạp|🚲,fire engine|xe cứu hỏa|🚒,journey|hành trình|🛣️,lift|đi nhờ xe/thang máy|🛗,motorway|đường cao tốc|🛣️,passenger|hành khách|💺,platform|sân ga|🚉,racing|đua xe|🏎️,railway|đường sắt|🛤️,rocket|tên lửa|🚀,spaceship|tàu vũ trụ|🛸,taxi|xe taxi|🚕,tour|chuyến du lịch|🗺️,traffic|giao thông|🚥,wheel|bánh xe|🛞',
    Work: 'actor|diễn viên|🎭,airport|sân bay|✈️,ambulance|xe cứu thương|🚑,artist|họa sĩ|🎨,astronaut|phi hành gia|👨‍🚀,business|kinh doanh|💼,businessman|doanh nhân|🕴️,designer|nhà thiết kế|🎨,engineer|kỹ sư|👷,factory|nhà máy|🏭,fire fighter|lính cứu hỏa|🧑‍🚒,job|công việc|💼,journalist|nhà báo|📰,manager|quản lý|🤵,mechanic|thợ máy|👨‍🔧,meeting|cuộc họp|🤝,news|tin tức|📰,newspaper|tờ báo|📰,office|văn phòng|🏢,photographer|nhiếp ảnh gia|📸,pilot|phi công|👨‍✈️,police officer|cảnh sát|👮,queen|nữ hoàng|👸,rocket|tên lửa|🚀,singer|ca sĩ|🎤,taxi|xe taxi|🚕,waiter|người phục vụ|🤵',
    World:
      'air|không khí|💨,bridge|cây cầu|🌉,castle|lâu đài|🏰,cave|hang động|🦇,desert|sa mạc|🏜️,Earth|Trái Đất|🌍,entrance|lối vào|🚪,environment|môi trường|🌱,exit|lối ra|🚪,fire|lửa|🔥,future|tương lai|🚀,hill|ngọn đồi|⛰️,land|đất liền|🏝️,ocean|đại dương|🌊,planet|hành tinh|🪐,pond|cái ao|🦆,space|không gian|🚀,stone|hòn đá|🪨,stream|dòng suối|🏞️,view|quang cảnh|🖼️,wood|gỗ/rừng|🪵',
  },
}

// Parser tự động giải nén dữ liệu RAW_VOCAB thành mảng Object dễ sử dụng
const VOCAB_DATA = {}
Object.keys(RAW_VOCAB).forEach((level) => {
  VOCAB_DATA[level] = {}
  Object.keys(RAW_VOCAB[level]).forEach((category) => {
    VOCAB_DATA[level][category] = RAW_VOCAB[level][category].split(',').map((item, index) => {
      const parts = item.split('|')
      return {
        id: `${level[0].toLowerCase()}_${category.toLowerCase().replace(/ /g, '_')}_${index}`,
        word: parts[0],
        meaning: parts[1],
        emoji: parts[2],
      }
    })
  })
})

const App = () => {
  const [level, setLevel] = useState('Starters')
  const [category, setCategory] = useState('Animals')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [view, setView] = useState('learn') // 'learn' | 'list'
  const [mastered, setMastered] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const scrollContainerRef = useRef(null)

  // Auto-select first category when level changes
  const categories = useMemo(() => Object.keys(VOCAB_DATA[level]), [level])

  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0])
    }
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [level, categories])

  useEffect(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [category])

  const currentList = VOCAB_DATA[level][category] || []

  const filteredList = useMemo(() => {
    return currentList.filter(
      (item) =>
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentList, searchQuery])

  const currentCard = currentList[currentIndex]

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleMastered = (id) => {
    setMastered((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const progress =
    Math.round(
      (mastered.filter((id) => currentList.some((item) => item.id === id)).length /
        currentList.length) *
        100
    ) || 0

  const scrollCategories = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-200">
              <Trophy size={22} />
            </div>
            <span className="xs:block hidden text-xl font-black tracking-tight">Cambridge ESL</span>
          </div>

          <div className="flex rounded-2xl bg-slate-100 p-1.5">
            {['Starters', 'Movers', 'Flyers'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`rounded-xl px-4 py-2 text-sm font-black transition-all ${
                  level === lvl
                    ? 'scale-105 bg-white text-indigo-600 shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setView('learn')}
              className={`rounded-xl p-2.5 transition ${view === 'learn' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
            >
              <Brain size={22} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-xl p-2.5 transition ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
            >
              <LayoutGrid size={22} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex w-full max-w-3xl flex-1 flex-col items-center p-4 md:p-8">
        {/* Category Scrollbar */}
        <div className="relative mb-6 flex w-full items-center gap-2">
          <button
            onClick={() => scrollCategories('left')}
            className="z-10 flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex flex-1 gap-2 overflow-x-auto scroll-smooth py-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-2xl border-2 px-6 py-3 text-sm font-black whitespace-nowrap transition-all ${
                  category === cat
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollCategories('right')}
            className="z-10 flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>

        {view === 'learn' && currentCard ? (
          <div className="animate-in fade-in flex w-full flex-col items-center duration-500">
            {/* Stats Card */}
            <div className="mb-8 flex w-full max-w-sm items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Category Progress
                </span>
                <span className="text-xl font-black text-indigo-600">{progress}%</span>
              </div>
              <div className="h-3 w-32 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Flashcard */}
            <div
              className="perspective-1000 group relative mb-10 aspect-[3/4] w-full max-w-sm cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className={`transform-style-3d relative h-full w-full transition-all duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center rounded-[3rem] border border-slate-100 bg-white p-10 shadow-2xl backface-hidden">
                  <div className="absolute top-10 flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2 text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                    <Layers size={14} />
                    {level} • {category}
                  </div>

                  <div className="mb-8 transform text-[10rem] leading-none drop-shadow-xl transition-transform duration-500 group-hover:scale-110">
                    {currentCard.emoji}
                  </div>

                  <h2 className="text-center text-6xl leading-none font-black tracking-tighter text-slate-800">
                    {currentCard.word}
                  </h2>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSpeak(currentCard.word)
                    }}
                    className={`mt-12 rounded-3xl p-6 shadow-xl transition-all ${isSpeaking ? 'scale-90 bg-indigo-600 text-white' : 'bg-slate-50 text-indigo-600 hover:bg-indigo-50'}`}
                  >
                    <Volume2 size={40} strokeWidth={3} />
                  </button>

                  <p className="absolute bottom-10 animate-pulse text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">
                    Touch to reveal
                  </p>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 flex h-full w-full rotate-y-180 flex-col items-center justify-center rounded-[3rem] border-[16px] border-white/5 bg-indigo-600 p-10 text-white shadow-2xl backface-hidden">
                  <span className="mb-6 text-3xl font-black tracking-tight uppercase opacity-40">
                    {currentCard.word}
                  </span>
                  <h3 className="text-center text-6xl leading-tight font-black drop-shadow-lg">
                    {currentCard.meaning}
                  </h3>
                  <div className="mt-16 flex h-28 w-28 items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/10 backdrop-blur-md">
                    <span className="text-6xl">{currentCard.emoji}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex w-full items-center justify-center gap-5">
              <button
                onClick={() => {
                  setIsFlipped(false)
                  setCurrentIndex((prev) => (prev - 1 + currentList.length) % currentList.length)
                }}
                className="rounded-[2rem] border border-slate-100 bg-white p-6 text-slate-400 shadow-xl transition-all hover:text-indigo-600 active:scale-90"
              >
                <ChevronLeft size={32} strokeWidth={3} />
              </button>

              <button
                onClick={() => toggleMastered(currentCard.id)}
                className={`flex items-center gap-3 rounded-[2rem] px-10 py-6 text-lg font-black shadow-xl transition-all active:scale-95 ${
                  mastered.includes(currentCard.id)
                    ? 'border-2 border-emerald-100 bg-emerald-50 text-emerald-600'
                    : 'bg-slate-900 text-white hover:bg-black'
                }`}
              >
                {mastered.includes(currentCard.id) ? <Check size={24} strokeWidth={3} /> : null}
                {mastered.includes(currentCard.id) ? 'Mastered' : 'Mark Learned'}
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false)
                  setCurrentIndex((prev) => (prev + 1) % currentList.length)
                }}
                className="rounded-[2rem] border border-slate-100 bg-white p-6 text-slate-400 shadow-xl transition-all hover:text-indigo-600 active:scale-90"
              >
                <ChevronRight size={32} strokeWidth={3} />
              </button>
            </div>

            <span className="mt-8 rounded-full border border-slate-100 bg-white px-6 py-2 text-sm font-black tracking-widest text-slate-300 shadow-sm">
              {currentIndex + 1} OF {currentList.length}
            </span>
          </div>
        ) : (
          /* List View */
          <div className="animate-in fade-in w-full overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-2xl duration-300">
            <div className="border-b border-slate-100 bg-slate-50/50 p-8">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="mb-2 text-2xl leading-none font-black tracking-tight text-slate-800">
                    {category}
                  </h3>
                  <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
                    {currentList.length} total words in this list
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search
                    size={20}
                    className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-300"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vocabulary..."
                    className="w-full rounded-3xl border border-slate-200 bg-white py-4 pr-6 pl-14 text-sm font-bold shadow-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="max-h-[65vh] divide-y divide-slate-50 overflow-y-auto">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between p-6 transition-all hover:bg-slate-50"
                >
                  <div className="flex items-center gap-6">
                    <span className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-slate-100 bg-white text-4xl shadow-sm transition-transform group-hover:scale-110">
                      {item.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-2xl font-black tracking-tighter text-slate-800">
                          {item.word}
                        </h4>
                        <button
                          onClick={() => handleSpeak(item.word)}
                          className="p-1.5 text-slate-200 transition-colors hover:text-indigo-600"
                        >
                          <Volume2 size={18} strokeWidth={3} />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-bold text-slate-500">{item.meaning}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMastered(item.id)}
                    className={`rounded-2xl p-4 transition-all ${
                      mastered.includes(item.id)
                        ? 'bg-emerald-50 text-emerald-500'
                        : 'bg-slate-50 text-slate-200 hover:bg-slate-100 hover:text-slate-300'
                    }`}
                  >
                    <Star
                      size={24}
                      fill={mastered.includes(item.id) ? 'currentColor' : 'none'}
                      strokeWidth={3}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
