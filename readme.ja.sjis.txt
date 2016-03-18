= 読んでね =

== 入っているもの ==

* song.html
* search.js
* ju4.css
* thema フォルダ
* json フォルダ
* jquery-2.2.1.min.js

json フォルダに、データを格納している。
著作権的に問題ありそうなので、中身は公開していない。
データはテキストファイルなので、Windowsメモ帳とかで編集できる。

== 使い方 ==

song.html を、Firefox か Safari で開く。

IEとかChromeでは動作しない。
セキュリティの設定で、ローカルデータを読まないため。

== エラー表示 ==

問題が発生すると、右上にエラーが表示される。
複数のエラーがある場合、一番最後のエラーとデータファイル名を表示する。

== データの書式 ==

=== ファイルの書式 ===

json 形式のテキストファイル。
Shift_JIS CrLf、つまり、Windows のメモ帳で読み書きできる。
1 レッスンが 1 ファイルに対応する。
曲順・曲名・アーティスト名が入る。

=== ファイル名 ===

コリオ番号から余計な記号を削除して、
小文字にして、
最後に .txt をつけたもの。

例) SH'BAM09 なら、shbam09.txt になる。

=== ディレクトリ ===

種目ごとにディレクトリを持ち、その中にファイルが入る。

bodyattack, shbam など、アルファベット小文字。

=== インデックスファイル ===

セレクトボックスの選択肢やエラーメッセージを格納したファイル。
index-*.txt という感じのファイル名。

==== index-class.txt ====

種目一覧。
ディレクトリ名と画面に表示する名前の対。

==== index-choreo.txt ====

コリオ番号一覧。
曲ファイル名に対応する名前で、表示と兼用。
種目ディレクトリごとにある。

==== index-song.txt ====

曲順一覧。
曲ファイル名で使われている曲順名称。
種目ディレクトリごとにある。

例) rpm/rpm69.txt

[
  {
    "order": "1曲目",
    "song": "Stronger",
    "artist": "Clean Bandit"
  },
  {
    "order": "2曲目",
    "song": "That's What I Like",
    "artist": "Flo Rida feat. Fitz"
  },
  {
    "order": "3曲目",
    "song": "Boom Boom Boom",
    "artist": "Nick Skitz"
  },
  {
    "order": "4曲目",
    "song": "White Lines",
    "artist": "Six60"
  },
  {
    "order": "5曲目",
    "song": "Gravity",
    "artist": "DJ Fresh feat. Ella Eyre"
  },
  {
    "order": "6曲目",
    "song": "Runaway (U & I) (Kaskade Remix)",
    "artist": "Galantis"
  },
  {
    "order": "7曲目",
    "song": "Generate",
    "artist": "Eric Prydz"
  },
  {
    "order": "8曲目",
    "song": "Lonely Town",
    "artist": "Brandon Flowers"
  },
  {
    "order": "OUTRO",
    "song": "Gemini",
    "artist": "What's So Not feat. George Maple"
  }
]

==== index-text.txt ====

エラーメッセージを格納。
エラーメッセージが気に入らなければ、ここで書き換えられる。

例) ファイルが見つかりません → ファイルねがっ

=== JSON 形式 ===

次のような、書式。2次元表。

[                      #先頭、大括弧開く
  {                    #1組のデータをまとめる中括弧開く
    "項目名": "データ",  #項目名とデータの対。ダブルコーテーションで囲い、間がコロン、改行前がカンマ
    "項目名": "データ"  #項目名とデータの対。ダブルコーテーションで囲い、間がコロン、最後はカンマ無し
  },                   #1組のデータをまとめる中括弧閉じる。改行前がカンマ
  {
    "項目名": "データ",
    "項目名": "データ"
  }                   #1組のデータをまとめる中括弧閉じる。最後はカンマ無し
]                     #末尾、大括弧閉じる

たとえば次のとおり。

[
  {
    "order": "1曲目",
    "song": "Four Five Seconds",
    "artist": "The Millennials"
  },
  {
    "order": "2曲目",
    "song": "Bills",
    "artist": "Power Music Workout"
  },
  {
    "order": "11曲目",
    "song": "Firestone",
    "artist": "Interior And The Stock"
  }
]

あるいは、次の書式。1次元リスト。

["1曲目", "2曲目", 
"3曲目", "4曲目"]

これは、項目名の無いデータだけを並べたもの。
一番最後、"4曲目" の後ろにはカンマがない。
適当な位置で改行してよい。

== データの追加 ==

次の手順。

# 対応する種目ディレクトリに、コリオ番号のついた曲ファイルを入れる。
# 同ディレクトリの index-choreo.txt に、コリオ番号を追加。
# 同ディレクトリの index-song.txt に、今までにない曲順を追加。

3番目は通常は不要。

例) ボディアタックに "BA999 X'MAS" を追加する。

0. json/bodyattack ディレクトリで作業。
1. ba999xmas.txt に曲リストを書きこむ。
    このとき、既存のファイルをコピーして書き換える方が楽。
2. index-choreo.txt に、 "BA999 X'MAS" を追加する。
    このとき、並びの先頭に入れるとよい。
3. index-song.txt に、これまでになかった、"前夜祭" という曲順を追加する。
    これは、相応しい順番の場所に。

ダブルコーテーションで囲む書式なので、
" を曲名とかに含むことはできない。
全角 ”にするとか、工夫する。
同様にシングルコーテーションも要注意なので、
全角 ’が無難。

Shift_JIS なので、Unicode 拡張文字は使えない。

一番最後のデータの後ろだけ、カンマ , が無いので注意する。

中括弧 {} と大括弧 [] を間違えないよう注意する。

== プログラムファイル ==

すべてのファイルは、Shift_JIS, CrLf で、メモ帳などで編集できる。

=== song.html ===

検索画面が入っている。
これをブラウザで開く。

=== LesMills Song Search.bat ===

Windows 用のバッチファイル。
Firefox を起動して、 song.html を読み込む。
Firefox インストール場所によっては、パスの書き換えが必要。

=== search.js ===

java script で書かれたプログラム本体。

=== jquery-2.2.1.min.js ===

https://jquery.com の配布する java script ライブラリファイル。
これは最新版ではない。
新しいものを別途ダウンロードした場合、
song.html 内で参照するファイル名を変更すれば使える。

=== thema ===

テーマフォルダ。
検索画面の概観を指定する css が入っている。
新しいテーマを作って、フォルダごと差し替えれば、着せ替えができる。
画像ファイルを追加して派手な画面にしたり、字のサイズを変えたりできる。

ju4.css と thema/thema.css が順に呼び出される。
ju4.css には、基本的な画面設定が入っている。
ここの設定を変えたい場合は、
ju4.css を直接変えずに、 thema.css で上書きした方がいい。

== Android 対応 ==

Android 版 Firefox に対応している。
しかし、ファイルマネージャーから開くと、エラーが出て動かないときがある。
これは、物理パスでなく、シンボリックリンクが使われているのがまずいから。

例) 外部SDの Document というフォルダに置いた場合

×  file://Removable/MicroSD/Document/lesmills-song-search/song.html
○  file://storage/MicroSD/Document/lesmills-song-search/song.html

Removable でなく storage を使えば動く。

別の解決策は、about:config で詳細設定を変更する方法。
security.fileuri.strict_origin_policy を false にすれば
Removable のパスでも動くが、セキュリティは緩くなる。

== Google Chrome 対応 ==

--allow-file-access-from-files オプションをつければ動く。

Mac の場合、
ターミナルで、このフォルダに移動してから、
open -a "/Applications/Google Chrome.app" song.html --args -allow-file-access-from-files

== iOS, iPad, iPhone 対応 ==

Firefox, Safari でローカルファイルを開く方法がわからない。
今のところ無理。

== 配布元 ==

https://github.com/osubera/lesmills-song-search

== ライセンス ==

プログラムのライセンスは、MIT および paid4e。
ざっくり言えば、リスペクトあれば好きに改変・再配布してよい。
データは自分で作るのが前提。
jquery は、jquery 配布元のライセンスによる。


