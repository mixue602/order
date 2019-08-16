package org.gome.search.handler.seo;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by root on 16-2-18.
 */
public class FilterFacet {

    private static List<String> words = new ArrayList<String>();  //词条列表
    private static DoubleArrayTrie dtire = new DoubleArrayTrie();
    private static final String dataDir = "/workspace/gateway/conf/";
    private static boolean isInit = false;

    private static void load() throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(dataDir+"sortedDelFacets.dic"));
        String line;
        while ((line = reader.readLine()) != null) {
            if(line.trim().length()==0) continue;
            words.add(line);
        }
        dtire.open(dataDir+"dtrie.dat");
        isInit = true;
    }

    static {
        if(!isInit){
            try {
                load();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static boolean isIncludeDelFacet(String facets){
        boolean flag = false;

        if(!(facets!=null&&facets.length()%4==0)) return flag;
        if(facets.indexOf("1dcd")%4==0)return flag;
        if(!isInit) {
            try {
                load();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        int count = facets.length()/4;
        for(int i=0;i<count;i++){
            String facet = facets.substring(i*4,(i+1)*4);
            int index = dtire.exactMatchSearch(facet);
            if(index>=0){
                flag = true;
//                System.out.println(words.get(index));
            }
        }
        return flag;
    }


    public static void main(String[] args) throws IOException {
        System.out.println(isIncludeDelFacet("1000fadfadsfcvqe"));
        //System.out.println(">>>>>>>>>"+words.get(dtire.exactMatchSearch("16yB")));
    }


    public static void test() throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader("/mdata/codedata/facets/sortedDelFacets.dic"));
//        BufferedReader reader = new BufferedReader(new FileReader("/mdata/codedata/facets/test.dat"));
        String line;
        List<String> words = new ArrayList<String>();  //词条列表
        Set<Character> charset = new HashSet<Character>();  //所有词条的字符集合
        while ((line = reader.readLine()) != null) {
            if(line.trim().length()==0) continue;
            words.add(line);
            // 制作一份码表debug
            for (char c : line.toCharArray()) {
                charset.add(c);
            }
        }
        reader.close();
        System.out.println("字典词条：" + words.size());

        {
            String infoCharsetValue = "";
            String infoCharsetCode = "";
            for (Character c : charset) {
                infoCharsetValue += c.charValue() + "     ";
                infoCharsetCode += (int) c.charValue() + " ";
            }
            infoCharsetValue += '\n';
            infoCharsetCode += '\n';
            System.out.print(infoCharsetValue);
            System.out.print(infoCharsetCode);
        }
        for(String word:words){
            System.out.println(word);
        }
        DoubleArrayTrie dat = new DoubleArrayTrie();
        System.out.println("是否错误: " + dat.build(words));
        //dat.dump();
        dat.save("/mdata/codedata/facets/dtrie.dat");
        List<Integer> integerList = dat.commonPrefixSearch("16yB");
        System.out.println(integerList);
        System.out.println(">>>>>>>>>"+words.get(dat.exactMatchSearch("16yB")));
        for (int index : integerList) {
            System.out.println(words.get(index));
        }
    }
}
